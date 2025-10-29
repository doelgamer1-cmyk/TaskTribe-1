
import React from 'react';

interface OnboardingCompleteScreenProps {
  onContinue: () => void;
}

const OnboardingCompleteScreen: React.FC<OnboardingCompleteScreenProps> = ({ onContinue }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-center">
            <div className="text-6xl mb-6 animate-confetti">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-2 animate-scale-up">You're All Set!</h1>
            <p className="text-gray-400 mb-8 max-w-sm animate-fade-in">Your professional profile is live and you're ready to start earning. Welcome to the Tribe!</p>
            <button 
                onClick={onContinue} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors animate-glow"
            >
                Explore Quests
            </button>
        </div>
    );
};

export default OnboardingCompleteScreen;
