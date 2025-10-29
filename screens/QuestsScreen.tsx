import React, { useState, useMemo } from 'react';
import { Quest, User } from '../types';
import BottomNavBar from '../components/common/BottomNavBar';
import QuestCard from '../components/common/QuestCard';
import { CompassIcon } from '../components/common/Icons';

interface QuestsScreenProps {
    user: User;
    quests: Quest[];
    onSelectQuest: (quest: Quest) => void;
    onNavigate: (view: 'home' | 'quests' | 'tribes' | 'profile') => void;
}

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-1/2 py-3 font-semibold text-center transition-colors ${isActive ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 border-b-2 border-transparent'}`}
    >
        {label}
    </button>
);

const QuestsScreen: React.FC<QuestsScreenProps> = ({ user, quests, onSelectQuest, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'find' | 'yours'>('find');

    const findQuests = useMemo(() => 
        quests.filter(q => q.status === 'OPEN' && q.creatorId !== user.username), 
    [quests, user.username]);
    
    const yourQuests = useMemo(() =>
        quests.filter(q => q.creatorId === user.username || q.winner?.userId === user.username),
    [quests, user.username]);

    const renderQuestList = (questList: Quest[]) => {
        if (questList.length === 0) {
            return (
                <div className="text-center py-20 px-4">
                    <CompassIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white">No Quests Here</h3>
                    <p className="text-gray-400 mt-2">
                        {activeTab === 'find' 
                            ? "Looks like all quests have been taken. Check back later!" 
                            : "You haven't created or started any quests yet."}
                    </p>
                </div>
            );
        }
        return (
            <div className="space-y-4">
                {questList.map(quest => (
                    <QuestCard key={quest.id} quest={quest} onSelect={onSelectQuest} currentUser={user} />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm p-4 text-center border-b border-gray-800">
                <h1 className="text-xl font-bold">Quests</h1>
            </header>
            
            <div className="flex border-b border-gray-800">
                <TabButton label="Find Quests" isActive={activeTab === 'find'} onClick={() => setActiveTab('find')} />
                <TabButton label="Your Quests" isActive={activeTab === 'yours'} onClick={() => setActiveTab('yours')} />
            </div>

            <main className="p-4">
                {activeTab === 'find' ? renderQuestList(findQuests) : renderQuestList(yourQuests)}
            </main>

            <BottomNavBar activeTab="quests" onNavigate={onNavigate} />
        </div>
    );
};

export default QuestsScreen;