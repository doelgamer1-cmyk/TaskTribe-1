import React from 'react';

interface BidSubmittedScreenProps {
  onContinue: () => void;
}

const BidSubmittedScreen: React.FC<BidSubmittedScreenProps> = ({ onContinue }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-center">
            <div className="text-6xl mb-6 animate-scale-up">📬</div>
            <h1 className="text-3xl font-bold text-white mb-2">Bid Sent!</h1>
            <p className="text-gray-400 mb-8 max-w-sm">
                Your proposal has been sent to the quest creator. You'll be notified if they accept your bid.
            </p>
            <button onClick={onContinue} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg">
                Back to Quests
            </button>
        </div>
    );
};

export default BidSubmittedScreen;