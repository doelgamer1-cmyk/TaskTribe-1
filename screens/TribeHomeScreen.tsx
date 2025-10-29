import React, { useState } from 'react';
import { Tribe, TribeMember, UserRole, ChatMessage } from '../types';
import BottomNavBar from '../components/common/BottomNavBar';
import { CrownIcon, ShieldIcon, LightningBoltIcon, UserCircleIcon, TrophyIcon } from '../components/common/Icons';
import MessageBox from '../components/common/MessageBox';
import UserInput from '../components/views/UserInput';
import TribeWarScreen from './TribeWarScreen'; // Import the war screen

const MOCK_MEMBERS: TribeMember[] = [
    { id: 1, name: 'Priya_Designs', level: 24, role: 'Leader', avatarUrl: 'https://placehold.co/64x64/a78bfa/FFFFFF?text=P', xp: 23500, questsCompleted: 42, bio: "...", skills: [] },
    { id: 2, name: 'Rahul_Design', level: 22, role: 'Co-Leader', avatarUrl: 'https://placehold.co/64x64/7dd3fc/FFFFFF?text=R', xp: 21000, questsCompleted: 38, bio: "...", skills: [] },
    { id: 3, name: 'Samira_Art', level: 18, role: 'Member', avatarUrl: 'https://placehold.co/64x64/fcd34d/FFFFFF?text=S', xp: 15000, questsCompleted: 25, bio: "...", skills: [] },
    { id: 4, name: 'Alex_Design', level: 1, role: 'Member', avatarUrl: 'https://placehold.co/64x64/86efac/FFFFFF?text=A', xp: 150, questsCompleted: 1, bio: "...", skills: [] },
];

interface TribeHomeScreenProps {
    tribe: Tribe;
    onNavigate: (view: 'home' | 'quests' | 'tribes' | 'profile') => void;
}

const StatCard: React.FC<{ value: string | number, label: string, icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="bg-gray-800/50 p-3 rounded-lg text-center flex-1">
        <div className="flex justify-center text-purple-400 mb-1">{icon}</div>
        <p className="text-md font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
    </div>
);

const TribeHomeScreen: React.FC<TribeHomeScreenProps> = ({ tribe, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'chat' | 'members'>('chat');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {role: 'system', content: `Priya_Designs started a vote to join the Weekend War.`},
        {role: 'model', content: "Hey team! Let's do the weekend war? We can win this!"},
        {role: 'user', content: "I'm in!"},
    ]);
    const [inWar, setInWar] = useState(false);

    if (inWar) {
        return <TribeWarScreen tribe={tribe} onEndWar={() => setInWar(false)} />;
    }

    const handleSend = (input: string) => {
        setMessages(prev => [...prev, {role: 'user', content: input}]);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20 flex flex-col">
            <header className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <img src={tribe.iconUrl} alt={tribe.name} className="w-12 h-12 rounded-lg" />
                    <div>
                        <h1 className="text-xl font-bold">{tribe.name}</h1>
                        <p className="text-sm text-gray-400">{tribe.levelName} Tribe</p>
                    </div>
                </div>
            </header>

            <div className="p-4">
                 <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600 to-red-500 text-white cursor-pointer" onClick={() => setInWar(true)}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg flex items-center gap-2"><TrophyIcon className="w-5 h-5"/> Weekend War #48</p>
                            <p className="text-sm opacity-90">Live Now! Ends in 14h 23m</p>
                        </div>
                        <p className="font-semibold bg-white/20 px-3 py-1 rounded-full text-sm">Join Event</p>
                    </div>
                </div>
            </div>

            <div className="flex border-b border-gray-800">
                <button onClick={() => setActiveTab('chat')} className={`w-1/2 py-3 font-semibold text-center transition-colors ${activeTab === 'chat' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500'}`}>Tribe Chat</button>
                <button onClick={() => setActiveTab('members')} className={`w-1/2 py-3 font-semibold text-center transition-colors ${activeTab === 'members' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500'}`}>Members ({tribe.members})</button>
            </div>

            {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                     <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                          msg.role === 'system' 
                          ? <div key={index} className="text-center text-xs text-purple-400 italic py-2">{msg.content}</div>
                          : <MessageBox key={index} message={msg} />
                        ))}
                    </div>
                    <UserInput onSend={handleSend} isLoading={false} placeholder="Message your tribe..." />
                </div>
            )}
            
            {activeTab === 'members' && (
                 <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {MOCK_MEMBERS.sort((a, b) => b.xp - a.xp).map(member => (
                        <div key={member.id} className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
                            <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <p className="font-semibold text-white flex items-center gap-1.5">
                                    {member.name}
                                    {member.role === 'Leader' && <CrownIcon className="w-4 h-4 text-yellow-400" />}
                                </p>
                                <p className="text-xs text-gray-400">Level {member.level} - {member.role}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-purple-300">{member.xp.toLocaleString()} XP</p>
                                <p className="text-xs text-gray-500">{member.questsCompleted} quests</p>
                            </div>
                        </div>
                    ))}
                 </div>
            )}

            <BottomNavBar activeTab="tribes" onNavigate={onNavigate} />
        </div>
    );
};

export default TribeHomeScreen;
