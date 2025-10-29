import React from 'react';
import { Quest, Bid, User } from '../types';
import { formatTimeLeft } from '../utils';
import { ArrowLeftIcon } from '../components/common/Icons';

interface QuestDetailScreenProps {
  quest: Quest;
  onApply: () => void;
  onBack: () => void;
  currentUser?: User; // Optional, to tailor UI
}

const QuestDetailScreen: React.FC<QuestDetailScreenProps> = ({ quest, onApply, onBack, currentUser }) => {
  const isCreator = currentUser?.username === quest.creatorId;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="relative h-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-indigo-900/50"></div>
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/30 rounded-full z-10">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
          <img src={quest.logo} alt={`${quest.company} logo`} className="h-16 w-16 rounded-xl bg-white p-1" />
          <div>
            <p className="text-sm text-gray-300">Quest by {quest.company}</p>
            <h1 className="text-2xl font-bold">{quest.title}</h1>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-24">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Type</p>
            <p className="font-semibold text-white">{quest.type}</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Level Req.</p>
            <p className="font-semibold text-white">{quest.level}+</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Time Left</p>
            <p className="font-semibold text-white">{formatTimeLeft(quest.deadline)}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{quest.description}</p>
        </div>

        {quest.bids.length > 0 && isCreator && (
            <div>
                 <h2 className="text-xl font-bold mb-2">Bids Received</h2>
                 <div className="space-y-3">
                    {quest.bids.map(bid => (
                        <div key={bid.userId} className="bg-gray-800/50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <img src={bid.avatarUrl} alt={bid.username} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{bid.username}</p>
                                        <p className="text-xs text-gray-400">Placed {formatTimeLeft(bid.timestamp)}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-lg text-purple-400">₹{bid.amount.toLocaleString()}</p>
                            </div>
                            <div className="mt-3 border-t border-gray-700/50 pt-3">
                                <p className="text-sm text-gray-300 whitespace-pre-wrap">{bid.proposal}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{quest.reward ? 'Reward' : 'Budget'}</p>
          <p className="text-2xl font-bold text-purple-400">
            {quest.reward ? `₹${quest.reward.toLocaleString()}` : `Up to ₹${quest.budget?.toLocaleString()}`}
          </p>
        </div>
        <button 
          onClick={onApply} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          {quest.budget ? (isCreator ? 'View Bids' : 'Place Bid') : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};

export default QuestDetailScreen;