

import React, { useState } from 'react';
import { Tribe } from '../types';
import { ArrowLeftIcon, CrownIcon, LightningBoltIcon, ShieldIcon, TrophyIcon, PlusIcon } from '../components/common/Icons';

interface TribeDetailScreenProps {
  tribe: Tribe;
  onJoin: () => void;
  onBack: () => void;
}

const StatCard: React.FC<{ value: string, label: string }> = ({ value, label }) => (
    <div className="bg-gray-800/50 p-3 rounded-lg text-center">
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
    </div>
);

// Components for tabs
const MemberItem: React.FC<{ name: string, level: number, role: 'Leader' | 'Co-Leader' | 'Member', avatarUrl: string }> = ({ name, level, role, avatarUrl }) => (
    <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
        <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full" />
        <div>
            <p className="font-semibold text-white flex items-center gap-1.5">
                {name}
                {role === 'Leader' && <CrownIcon className="w-4 h-4 text-yellow-400" />}
            </p>
            <p className="text-xs text-gray-400">Level {level} - {role}</p>
        </div>
    </div>
);

const TreasuryItem: React.FC<{ title: string, amount: string, icon: React.ReactNode }> = ({ title, amount, icon }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-4">
        <div className="p-3 bg-gray-700 rounded-full">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-white font-bold text-xl">{amount}</p>
        </div>
    </div>
);

const HistoryItem: React.FC<{ title: string, description: string, time: string, icon: React.ReactNode }> = ({ title, description, time, icon }) => (
    <div className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-lg">
        <div className="p-2 bg-gray-700 rounded-full mt-1">{icon}</div>
        <div>
            <p className="font-semibold text-white">{title}</p>
            <p className="text-sm text-gray-400">{description}</p>
            <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
    </div>
);

const TribeDetailScreen: React.FC<TribeDetailScreenProps> = ({ tribe, onJoin, onBack }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      <header className="relative h-40">
        <img src={tribe.bannerUrl} alt={`${tribe.name} banner`} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/30 rounded-full"><ArrowLeftIcon className="w-6 h-6"/></button>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center">
            <img src={tribe.iconUrl} alt={`${tribe.name} icon`} className="h-20 w-20 rounded-full border-4 border-gray-900 mx-auto" />
            <h1 className="text-2xl font-bold mt-2">{tribe.name}</h1>
            <p className="text-sm text-gray-400">"{tribe.tagline}"</p>
        </div>
      </header>

      <main className="pt-16 p-4">
        <div className="grid grid-cols-4 gap-2 mb-6">
            <StatCard value={`${tribe.level}K`} label="Total XP" />
            <StatCard value={`${tribe.members}/${tribe.maxMembers}`} label="Members" />
            <StatCard value={`#${tribe.rank}`} label="Rank" />
            <StatCard value={`${tribe.winRate}%`} label="Win Rate" />
        </div>

        <div className="flex border-b border-gray-700 mb-4">
            {['Overview', 'Members', 'Treasury', 'History'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-semibold ${activeTab === tab ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500'}`}>
                    {tab}
                </button>
            ))}
        </div>
        
        {activeTab === 'Overview' && (
            <div className="space-y-6 animate-fade-in">
                <section>
                    <h3 className="font-bold text-lg mb-2">About Us</h3>
                    <p className="text-gray-300 text-sm">We're a community of designers helping each other grow. Whether you're just starting or already pro, everyone's welcome. We focus on creative tasks, share tips, and compete hard in wars!</p>
                </section>
                <section>
                    <h3 className="font-bold text-lg mb-2">Leadership</h3>
                     <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">P</div>
                        <div>
                            <p className="font-semibold text-white flex items-center gap-1">Priya_Designs <CrownIcon className="w-4 h-4 text-yellow-400"/></p>
                            <p className="text-xs text-gray-400">Leader - Level 24</p>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'Members' && (
            <div className="space-y-3 animate-fade-in">
                <MemberItem name="Priya_Designs" level={24} role="Leader" avatarUrl="https://placehold.co/64x64/a78bfa/FFFFFF?text=P" />
                <MemberItem name="Rahul_Design" level={22} role="Co-Leader" avatarUrl="https://placehold.co/64x64/7dd3fc/FFFFFF?text=R" />
                <MemberItem name="Samira_Art" level={18} role="Member" avatarUrl="https://placehold.co/64x64/fcd34d/FFFFFF?text=S" />
                <MemberItem name="Dev_Coder" level={15} role="Member" avatarUrl="https://placehold.co/64x64/fca5a5/FFFFFF?text=D" />
                <MemberItem name="Alex_Design" level={1} role="Member" avatarUrl="https://placehold.co/64x64/86efac/FFFFFF?text=A" />
            </div>
        )}

        {activeTab === 'Treasury' && (
            <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                    <TreasuryItem title="Total XP Earned" amount="18,450" icon={<LightningBoltIcon className="w-6 h-6 text-purple-400" />} />
                    <TreasuryItem title="War Chest" amount="5,200 SP" icon={<ShieldIcon className="w-6 h-6 text-yellow-400" />} />
                </div>
                <div>
                    <h3 className="font-bold text-lg my-4">Recent Activity</h3>
                    <div className="space-y-2 text-sm p-4 bg-gray-800/50 rounded-lg">
                        <p className="flex justify-between"><span>Weekend War Victory</span><span className="font-semibold text-green-400">+250 SP</span></p>
                        <p className="flex justify-between"><span>Contribution by Priya_Designs</span><span className="font-semibold text-green-400">+50 SP</span></p>
                        <p className="flex justify-between"><span>Tribe Banner Upgrade</span><span className="font-semibold text-red-400">-100 SP</span></p>
                        <p className="flex justify-between"><span>Contribution by Rahul_Design</span><span className="font-semibold text-green-400">+50 SP</span></p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'History' && (
            <div className="space-y-3 animate-fade-in">
                <HistoryItem 
                    title="Won Weekend War #47" 
                    description="Placed 1st against 20 other tribes." 
                    time="2 days ago"
                    icon={<TrophyIcon className="w-5 h-5 text-yellow-400" />} />
                <HistoryItem 
                    title="Alex_Design Joined" 
                    description="Welcome our newest member!" 
                    time="3 days ago"
                    icon={<PlusIcon className="w-5 h-5 text-green-400" />} />
                <HistoryItem 
                    title="Reached Gold Tier" 
                    description="The tribe has been promoted!" 
                    time="1 week ago"
                    icon={<ShieldIcon className="w-5 h-5 text-blue-400" />} />
            </div>
        )}

      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
          <button 
            onClick={onJoin}
            className="w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white animate-glow"
          >
              Join Tribe
          </button>
      </div>
    </div>
  );
};

export default TribeDetailScreen;