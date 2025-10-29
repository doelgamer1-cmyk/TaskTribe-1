import React from 'react';

interface SubmissionConfirmationScreenProps {
  onContinue: () => void;
}

const SubmissionConfirmationScreen: React.FC<SubmissionConfirmationScreenProps> = ({ onContinue }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-center">
            <div className="text-6xl mb-6">👍</div>
            <h1 className="text-3xl font-bold text-white mb-2">Task Submitted!</h1>
            <p className="text-gray-400 mb-8">It will be reviewed shortly. Great work!</p>
            <button onClick={onContinue} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg">See Result</button>
        </div>
    );
};

export default SubmissionConfirmationScreen;
