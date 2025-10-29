import React, { useState } from 'react';
import { Quest } from '../types';

interface ActiveTaskScreenProps {
  quest: Quest;
  onSubmit: (submission: string) => void;
}

const ActiveTaskScreen: React.FC<ActiveTaskScreenProps> = ({ quest, onSubmit }) => {
    const [submissionText, setSubmissionText] = useState('');

    const handleSubmit = () => {
        if (submissionText.trim()) {
            onSubmit(submissionText);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <header className="p-4 flex items-center border-b border-gray-800">
                <div className="flex-1">
                    <p className="text-sm text-gray-400">Working on:</p>
                    <h1 className="text-lg font-bold truncate">{quest.title}</h1>
                </div>
            </header>

            <div className="flex-1 flex flex-col p-4 md:p-8">
                <div className="w-full max-w-2xl mx-auto flex flex-col flex-1">
                    <h2 className="text-2xl font-bold mb-4">Your Submission</h2>
                    <p className="text-gray-400 mb-4">
                        Enter your final submission text, links, or notes here. The client will review this once you submit.
                    </p>
                    <textarea 
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        className="flex-1 w-full bg-gray-800 border border-gray-700 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Type your submission here..."
                    ></textarea>
                    <button 
                        onClick={handleSubmit}
                        disabled={!submissionText.trim()}
                        className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                        Submit Task for Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveTaskScreen;
