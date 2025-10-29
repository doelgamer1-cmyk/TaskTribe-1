import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
// FIX: Corrected import path for geminiService and ensured the service file is not empty.
import { generateMapsResponse } from '../../services/geminiService';
import MessageBox from './MessageBox';
import UserInput from '../views/UserInput';

const MapsView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'Ask location-based questions like "What are some good cafes near me?"' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError(null);
      },
      (error) => {
        setLocationError("Could not get location. Please enable location services. You can still ask non-relative questions.");
        console.error("Geolocation error:", error);
      },
       { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (input: string) => {
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await generateMapsResponse(input, location);
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const modelMessage: ChatMessage = { 
        role: 'model', 
        content: response.text,
        grounding: groundingChunks.filter(c => c.maps)
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error generating maps response:", error);
      const errorMessage: ChatMessage = { role: 'system', content: "Sorry, I couldn't find an answer for that. Please try a different question." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
       <div className="p-4 border-b border-gray-700/50">
        <h2 className="text-xl font-semibold">Local Explorer</h2>
        <p className="text-sm text-gray-400">Find places with Gemini and Google Maps grounding.</p>
        {locationError && <div className="mt-2 text-sm text-amber-400 bg-amber-900/50 border border-amber-600/50 rounded-md p-2">{locationError}</div>}
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          msg.role === 'system' 
          ? <div key={index} className="text-center text-sm text-gray-500 py-2">{msg.content}</div>
          : <MessageBox key={index} message={msg} />
        ))}
         {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-prose rounded-2xl px-5 py-3 bg-gray-700 text-gray-200 rounded-bl-none flex items-center">
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse mr-2"></div>
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse mr-2 delay-150"></div>
               <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}
      </div>
      <UserInput onSend={handleSend} isLoading={isLoading} placeholder="Ask for places, e.g., 'restaurants near me'..." />
    </div>
  );
};

export default MapsView;