import React from 'react';
import { Quest, User } from '../../types';
import { formatTimeLeft } from '../../utils';
import { FireIcon } from './Icons';

interface QuestCardProps {
  quest: Quest;
  onSelect: (quest: Quest) => void;
  currentUser?: User;
}

const typeColors = {
  'Skill': 'bg-blue-600/20 text-blue-300 border-blue-500/50',
  'Creative': 'bg-purple-600/20 text-purple-300 border-purple-500/50',
  'Community': 'bg-green-600/20 text-green-300 border-green-500/50',
  'Professional': 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50',
};

const QuestCard: React.FC<QuestCardProps> = ({ quest, onSelect, currentUser }) => {
  const isUrgent = quest.deadline.getTime() - Date.now() < 24 * 60 * 60 * 1000;
  const isCreator = currentUser?.username === quest.creatorId;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 space-y-3 transition-colors hover:border-purple-500/50">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
            <img src={quest.logo} alt={`${quest.company} logo`} className="h-10 w-10 rounded-lg bg-white p-1" />
            <div>
              <h3 className="font-bold text-white leading-tight">{quest.title}</h3>
              <p className="text-sm text-gray-400">by {quest.company}</p>
            </div>
        </div>
        {isUrgent && (
            <div className="flex-shrink-0 ml-2 flex items-center gap-1 bg-red-600/20 text-red-300 text-xs font-semibold px-2 py-1 rounded-full">
                <FireIcon className="w-3 h-3" />
                <span>Urgent</span>
            </div>
        )}
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-300">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${typeColors[quest.type] || typeColors['Skill']}`}>{quest.type}</span>
        <span>•</span>
        <span>{formatTimeLeft(quest.deadline)}</span>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="text-lg font-bold text-purple-400">
          {quest.reward ? `₹${quest.reward}` : `Up to ₹${quest.budget?.toLocaleString()}`}
        </div>
        <button onClick={() => onSelect(quest)} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          {quest.reward ? 'View Quest' : (isCreator ? 'Show Bids' : 'Bid Now')}
        </button>
      </div>
    </div>
  );
};

export default QuestCard;