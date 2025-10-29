
import React from 'react';
import { Tribe } from '../../types';

interface TribeCardProps {
  tribe: Tribe;
  onSelect: (tribe: Tribe) => void;
}

const statusColors = {
  Recruiting: 'bg-green-500/20 text-green-300',
  'Invite Only': 'bg-blue-500/20 text-blue-300',
  Full: 'bg-red-500/20 text-red-300',
};

const TribeCard: React.FC<TribeCardProps> = ({ tribe, onSelect }) => {
  return (
    <div className="bg-gray-800/70 border border-gray-700 rounded-2xl overflow-hidden transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20">
      <div className="relative h-24 bg-cover bg-center" style={{ backgroundImage: `url(${tribe.bannerUrl})` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <img src={tribe.iconUrl} alt={`${tribe.name} icon`} className="h-16 w-16 rounded-full border-4 border-gray-800 bg-gray-700" />
        </div>
      </div>
      <div className="pt-10 p-4 text-center">
        <h3 className="text-xl font-bold text-white">{tribe.name}</h3>
        <p className="text-sm text-gray-400 mb-2">"{tribe.tagline}"</p>
        <span className="inline-block bg-yellow-500/20 text-yellow-300 text-xs font-semibold px-2 py-0.5 rounded-full mb-4">
          Level {tribe.level} - {tribe.levelName} Tribe
        </span>
      </div>
      <div className="px-4 pb-4 space-y-3">
        <div className="flex justify-around text-center text-sm">
          <div>
            <p className="font-bold text-white">{tribe.members}/{tribe.maxMembers}</p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
          <div>
            <p className="font-bold text-white">#{tribe.rank}</p>
            <p className="text-xs text-gray-500">Rank</p>
          </div>
          <div>
            <p className="font-bold text-white">{tribe.winRate}%</p>
            <p className="text-xs text-gray-500">Win Rate</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {tribe.tags.map(tag => (
            <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-full">{tag}</span>
          ))}
           <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[tribe.status]}`}>{tribe.status}</span>
        </div>
        <button 
          onClick={() => onSelect(tribe)} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TribeCard;
