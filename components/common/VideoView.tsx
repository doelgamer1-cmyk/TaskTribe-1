import React, { useState } from 'react';
// FIX: Corrected import path for geminiService and ensured the service file is not empty.
import { analyzeVideo } from '../../services/geminiService';
import Spinner from '../views/Spinner';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const VideoView: React.FC = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
       if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }
      setVideo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResponse('');
      setError('');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!video || !prompt) {
      setError('Please upload a video and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const videoData = await fileToBase64(video);
      const result = await analyzeVideo(videoData, video.type, prompt);
      setResponse(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze video. It might be too long or in an unsupported format. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="p-4 border-b border-gray-700/50">
        <h2 className="text-xl font-semibold">Video Analyzer</h2>
        <p className="text-sm text-gray-400">Upload a short video and ask questions about it with gemini-2.5-pro.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Pane */}
        <div className="flex flex-col space-y-4 bg-gray-900/50 p-6 rounded-lg">
          <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm rounded-lg p-3">
            <strong>Warning:</strong> For browser stability, please use small video files (under {MAX_FILE_SIZE_MB}MB). Large files may cause the app to crash.
          </div>
          <div>
            <label htmlFor="video-upload" className="block text-sm font-medium text-gray-300 mb-2">1. Upload Video (Max {MAX_FILE_SIZE_MB}MB)</label>
            <input id="video-upload" type="file" accept="video/*" onChange={handleVideoChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
          </div>
          {videoPreview && (
            <div className="mt-4 flex justify-center p-2 bg-black/20 rounded-lg">
              <video src={videoPreview} controls className="max-h-64 rounded-md" />
            </div>
          )}
          <div className="flex-grow flex flex-col">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">2. Ask a question about the video</label>
            <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="flex-grow w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Summarize this video."></textarea>
          </div>
          <button onClick={handleSubmit} disabled={isLoading || !video || !prompt} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg disabled:bg-indigo-900 disabled:opacity-50 transition-colors flex items-center justify-center">
            {isLoading ? <Spinner /> : 'Analyze Video'}
          </button>
        </div>

        {/* Right Pane */}
        <div className="flex flex-col bg-gray-900/50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Analysis Result</h3>
          <div className="flex-1 overflow-y-auto bg-gray-700/50 rounded-lg p-4 whitespace-pre-wrap">
            {isLoading && <p className="text-gray-400">Analyzing, this may take a moment...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {response && <p>{response}</p>}
            {!isLoading && !error && !response && <p className="text-gray-500">The analysis from Gemini will appear here.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoView;