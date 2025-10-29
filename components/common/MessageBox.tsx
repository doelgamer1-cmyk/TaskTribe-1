import React from 'react';
import { ChatMessage } from '../../types';

interface MessageBoxProps {
  message: ChatMessage;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-prose rounded-2xl px-5 py-3 ${isModel ? 'bg-gray-700 text-gray-200 rounded-bl-none' : 'bg-indigo-600 text-white rounded-br-none'}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.grounding && message.grounding.length > 0 && (
            <div className="mt-3 border-t border-gray-600 pt-2">
                <p className="text-xs font-semibold mb-1 text-gray-400">Sources:</p>
                <ul className="list-disc list-inside text-sm">
                    {/* FIX: Safely render grounding chunks by checking for optional properties and provide a fallback for title. */}
                    {message.grounding.map((chunk, index) => (
                        chunk.maps?.uri && <li key={index}><a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:underline">{chunk.maps.title || chunk.maps.uri}</a></li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;