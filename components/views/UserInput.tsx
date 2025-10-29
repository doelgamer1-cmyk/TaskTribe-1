import React, { useState } from 'react';

interface UserInputProps {
  onSend: (input: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const UserInput: React.FC<UserInputProps> = ({ onSend, isLoading, placeholder }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-700/50">
      <div className="flex items-center bg-gray-700 rounded-full px-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type your message...'}
          className="flex-1 bg-transparent p-3 text-white placeholder-gray-400 focus:outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 text-white rounded-full p-2 disabled:bg-indigo-900 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UserInput;
