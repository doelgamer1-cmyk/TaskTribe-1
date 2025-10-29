import React from 'react';
import { TribeMember } from '../types';
import { ArrowLeftIcon, CheckCircleIcon, LightningBoltIcon, ShieldIcon } from '../components/common/Icons';

interface MemberProfileScreenProps {
  member: TribeMember;
  onBack: () => void;
}

const StatCard: React.FC<{ value: string | number, label: string }> = ({ value, label }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg text-center flex-1">
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
    </div>
);

const MemberProfileScreen: React.FC<MemberProfileScreenProps> = ({ member, onBack }) => {
  const xpForNextLevel = 1000 * member.level;
  const xpProgress = (member.xp / xpForNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="relative h-24 bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/30 rounded-full z-10"><ArrowLeftIcon className="w-6 h-6"/></button>
        <div className="absolute -bottom-12 w-full flex justify-center">
            <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 bg-gray-700 rounded-full border-4 border-gray-900" />
        </div>
      </header>
      <main className="pt-16 p-4 space-y-6">
        <div className="text-center">
            <h1 className="text-2xl font-bold">{member.name}</h1>
            <p className="text-purple-300 font-semibold">Level {member.level} - {member.role}</p>
        </div>
        
        <div className="flex gap-4">
            <StatCard value={member.level} label="Level" />
            <StatCard value={member.questsCompleted} label="Quests Done" />
        </div>
        
        <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-gray-300">XP Progress</span>
                <span className="font-semibold">{member.xp} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${xpProgress}%` }}></div>
            </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Bio</h3>
            <p className="text-gray-300 text-sm">{member.bio || "This member hasn't written a bio yet."}</p>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Skills</h3>
            {member.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {member.skills.map(skill => (
                        <span key={skill} className="bg-indigo-600/50 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-sm">No skills listed yet.</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default MemberProfileScreen;
