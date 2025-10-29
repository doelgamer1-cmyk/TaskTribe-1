
import React from 'react';
import { Quest } from '../types';

interface QuestApplicationScreenProps {
  quest: Quest;
  onSubmit: () => void;
  onBack: () => void;
}

const QuestApplicationScreen: React.FC<QuestApplicationScreenProps> = ({ quest, onSubmit, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <button onClick={onBack} className="mb-4 text-purple-400">&larr; Back to Details</button>
            <h1 className="text-2xl font-bold mb-2">Apply for "{quest.title}"</h1>
            <p className="text-gray-400 mb-4">Tell them why you're a good fit!</p>
            <textarea className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white" placeholder="I'm a great fit because I have experience in graphic design and I'm passionate about creating unique art..."></textarea>
            <button onClick={onSubmit} className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg">Submit Application</button>
        </div>
    );
};

export default QuestApplicationScreen;
