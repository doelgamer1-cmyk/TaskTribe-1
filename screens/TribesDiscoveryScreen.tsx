

import React from 'react';
import TribeCard from '../components/common/TribeCard';
import { SearchIcon, FilterIcon, PlusIcon, ArrowLeftIcon } from '../components/common/Icons';
import { Tribe } from '../types';

const mockTribes: Tribe[] = [
  { id: 't1', name: 'Design Warriors', tagline: "Creating beauty, one pixel at a time", level: 18, levelName: "Gold", members: 42, maxMembers: 50, rank: 3, winRate: 67, tags: ["Design", "Creative", "Active"], status: 'Recruiting', bannerUrl: 'https://placehold.co/600x200/1a1a2e/e94560', iconUrl: 'https://placehold.co/64x64/e94560/1a1a2e?text=DW' },
  { id: 't2', name: 'Tech Titans', tagline: "Building the future, one line of code", level: 25, levelName: "Platinum", members: 50, maxMembers: 50, rank: 1, winRate: 82, tags: ["Tech", "Community", "All-Rounder"], status: 'Full', bannerUrl: 'https://placehold.co/600x200/007BFF/FFFFFF', iconUrl: 'https://placehold.co/64x64/FFFFFF/007BFF?text=TT' },
  { id: 't3', name: 'Eco Warriors', tagline: "Saving the planet, one task at a time", level: 12, levelName: "Silver", members: 35, maxMembers: 40, rank: 8, winRate: 55, tags: ["Community", "Social Good"], status: 'Recruiting', bannerUrl: 'https://placehold.co/600x200/28a745/FFFFFF', iconUrl: 'https://placehold.co/64x64/FFFFFF/28a745?text=EW' },
];

interface TribesDiscoveryScreenProps {
    onSelectTribe: (tribe: Tribe) => void;
    onBack: () => void;
}

const FilterPill: React.FC<{label: string, isActive?: boolean}> = ({ label, isActive }) => (
    <button className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
        {label}
    </button>
)

const TribesDiscoveryScreen: React.FC<TribesDiscoveryScreenProps> = ({ onSelectTribe, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2"><ArrowLeftIcon className="w-6 h-6"/></button>
        <h1 className="text-xl font-bold">Tribes</h1>
        <button className="p-2 -mr-2"><FilterIcon className="w-6 h-6"/></button>
      </header>

      <main className="p-4 space-y-6">
        <div className="bg-gradient-to-br from-purple-600/50 to-indigo-600/50 p-6 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-2">Join a Tribe Today!</h2>
            <p className="text-gray-300 mb-4">Compete together, earn together, win together.</p>
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-5 rounded-full text-sm">How Tribes Work</button>
        </div>

        <div className="relative">
            <input 
              type="text" 
              placeholder="Search tribes by name or interest..." 
              className="w-full bg-gray-800 border border-gray-700 rounded-full px-5 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>

        <div className="flex overflow-x-auto space-x-3 pb-2 -mx-4 px-4">
            <FilterPill label="All" isActive />
            <FilterPill label="Recruiting" />
            <FilterPill label="My City" />
            <FilterPill label="Top Ranked" />
            <FilterPill label="New" />
        </div>

        <div className="space-y-4">
            {mockTribes.map(tribe => (
              <TribeCard key={tribe.id} tribe={tribe} onSelect={onSelectTribe} />
            ))}
        </div>
      </main>
      
      <button className="fixed bottom-20 right-4 bg-purple-600 hover:bg-purple-700 text-white font-bold p-4 rounded-full shadow-lg shadow-purple-600/30 flex items-center gap-2">
        <PlusIcon className="w-6 h-6" />
        <span className="hidden sm:block">Create Tribe</span>
      </button>
    </div>
  );
};

export default TribesDiscoveryScreen;