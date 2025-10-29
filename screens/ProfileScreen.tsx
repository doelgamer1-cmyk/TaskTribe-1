import React, { useState } from 'react';
import { User, Quest } from '../types';
import { ArrowLeftIcon, BriefcaseIcon, CheckCircleIcon, PencilAltIcon } from '../components/common/Icons';
import QuestCard from '../components/common/QuestCard';

interface ProfileScreenProps {
  user: User;
  quests: Quest[];
  onBack: () => void;
  onSelectQuest: (quest: Quest) => void;
}

const StatCard: React.FC<{ value: string | number, label: string, icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg text-center flex-1">
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
    </div>
);

const TeenProfileView: React.FC<{ user: User }> = ({ user }) => {
    const xpForNextLevel = 1000 * user.level;
    const xpProgress = (user.xp / xpForNextLevel) * 100;

    return (
        <>
            <div className="text-center">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-purple-300 font-semibold">Level {user.level} - Newbie</p>
            </div>
             <div className="bg-gray-800 p-4 rounded-xl my-6">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-gray-300">Level {user.level}</span>
                    <span className="font-semibold">{user.xp} / {xpForNextLevel} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${xpProgress}%` }}></div>
                </div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-center text-yellow-300">Skill Points Vault</h3>
                <p className="text-4xl font-bold text-center text-white">{(user.xp * 2.5).toLocaleString()} SP</p>
                <p className="text-xs text-gray-400 text-center mt-1">Convert to cash when you turn 18!</p>
            </div>
        </>
    );
};

const AdultProfileView: React.FC<{ user: User; quests: Quest[]; onSelectQuest: (quest: Quest) => void; }> = ({ user, quests, onSelectQuest }) => {
    const [activeTab, setActiveTab] = useState('quests');
    
    const userPostedQuests = quests.filter(q => q.creatorId === user.username);
    
    return (
        <>
            <div className="text-center">
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <p className="text-indigo-300 font-semibold">{user.headline}</p>
            </div>
            <div className="flex gap-4 my-6">
                <StatCard value={`₹${(user.tasksCompleted * 150).toLocaleString()}`} label="Total Earned" icon={<BriefcaseIcon className="w-6 h-6 text-green-400"/>} />
                <StatCard value={user.tasksCompleted} label="Quests Done" icon={<CheckCircleIcon className="w-6 h-6 text-purple-400"/>} />
                <StatCard value={user.rating} label="Rating" icon={<PencilAltIcon className="w-6 h-6 text-yellow-400"/>} />
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
                 <div className="flex bg-gray-900/50 rounded-lg p-1 mb-4">
                    <button onClick={() => setActiveTab('profile')} className={`w-1/3 py-2 rounded-md font-semibold transition-colors ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>Profile</button>
                    <button onClick={() => setActiveTab('bids')} className={`w-1/3 py-2 rounded-md font-semibold transition-colors ${activeTab === 'bids' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>My Bids</button>
                    <button onClick={() => setActiveTab('quests')} className={`w-1/3 py-2 rounded-md font-semibold transition-colors ${activeTab === 'quests' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>My Quests</button>
                </div>
                {activeTab === 'profile' && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg mb-1">Bio</h3>
                            <p className="text-gray-300 text-sm">{user.bio}</p>
                        </div>
                         <div>
                            <h3 className="font-bold text-lg mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills?.map(skill => (
                                    <span key={skill} className="bg-indigo-600/50 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                 {activeTab === 'bids' && <div className="text-center py-4 text-gray-400">You haven't placed any bids yet.</div>}
                 {activeTab === 'quests' && (
                    <div className="space-y-4">
                        {userPostedQuests.length > 0 ? (
                            userPostedQuests.map(quest => (
                                <QuestCard key={quest.id} quest={quest} onSelect={onSelectQuest} currentUser={user} />
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-400">You haven't posted any quests.</div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, quests, onBack, onSelectQuest }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="relative h-24 bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/30 rounded-full z-10"><ArrowLeftIcon className="w-6 h-6"/></button>
        <div className="absolute -bottom-12 w-full flex justify-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-900 font-bold text-4xl text-white bg-cover bg-center" style={{backgroundImage: `url(https://placehold.co/96x96/86efac/FFFFFF?text=${user.username.charAt(0).toUpperCase()})`}}>
            </div>
        </div>
      </header>
      <main className="pt-16 p-4">
        {user.isAdult ? <AdultProfileView user={user} quests={quests} onSelectQuest={onSelectQuest} /> : <TeenProfileView user={user} />}
      </main>
    </div>
  );
};

export default ProfileScreen;