

import React from 'react';
import { Quest } from '../types';

interface QuestCompleteScreenProps {
  quest: Quest;
  onContinue: () => void;
}

const QuestCompleteScreen: React.FC<QuestCompleteScreenProps> = ({ quest, onContinue }) => {
    const reward = quest.reward || quest.winner?.bidAmount || 50;
    const isBid = !!quest.winner;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-center">
            <div className="text-6xl mb-6 animate-confetti">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-2">Submission Approved!</h1>
            <p className="text-gray-400 mb-4">Your work has been verified. You earned:</p>
            <p className="text-4xl font-bold text-purple-400 mb-8">
                {isBid ? `₹${reward.toLocaleString()}` : `${reward} Skill Points!`}
            </p>
            <button onClick={onContinue} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg">
                Awesome!
            </button>
        </div>
    );
};

export default QuestCompleteScreen;