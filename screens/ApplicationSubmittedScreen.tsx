import React from 'react';

interface ApplicationSubmittedScreenProps {
  onContinue: () => void;
}

const ApplicationSubmittedScreen: React.FC<ApplicationSubmittedScreenProps> = ({ onContinue }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-white mb-2">Application Sent!</h1>
            <p className="text-gray-400 mb-8">You'll be notified if you're selected. For now, let's assume you were!</p>
            <button onClick={onContinue} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg">Start Task</button>
        </div>
    );
};

export default ApplicationSubmittedScreen;
