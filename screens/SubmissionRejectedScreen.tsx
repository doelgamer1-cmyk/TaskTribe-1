import React from 'react';

interface SubmissionRejectedScreenProps {
  reason: string;
  onRetry: () => void;
}

const SubmissionRejectedScreen: React.FC<SubmissionRejectedScreenProps> = ({ reason, onRetry }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-center">
            <div className="text-6xl mb-6">🚫</div>
            <h1 className="text-3xl font-bold text-white mb-2">Submission Rejected</h1>
            <p className="text-gray-400 mb-6">Your submission did not meet our community guidelines.</p>
            <div className="w-full max-w-md bg-red-900/50 border border-red-700/50 rounded-lg p-4 mb-8">
                <p className="font-semibold text-red-300">Reason:</p>
                <p className="text-red-300/90">{reason}</p>
            </div>
            <button 
                onClick={onRetry} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
                Edit & Resubmit
            </button>
        </div>
    );
};

export default SubmissionRejectedScreen;