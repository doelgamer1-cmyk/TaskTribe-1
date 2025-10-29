import React, { useState, useEffect, useMemo } from 'react';
import BottomNavBar from '../components/common/BottomNavBar';
import QuestCard from '../components/common/QuestCard';
import WelcomeTutorial from '../components/common/WelcomeTutorial';
import { BellIcon, SearchIcon, PencilAltIcon } from '../components/common/Icons';
import { Quest, User } from '../types';

const mockTribes = [
    { name: "Design Warriors", members: "38 members", level: "Level 5", icon: "🎨" },
    { name: "Code Wizards", members: "24 members", level: "Level 8", icon: "💻" }
];

interface HomeScreenProps {
    user: User;
    quests: Quest[];
    onNavigate: (view: 'home' | 'quests' | 'tribes' | 'profile') => void;
    onSelectQuest: (quest: Quest) => void;
    onCreateQuest: () => void;
}

const SortPill: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
    >
        {label}
    </button>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ user, quests, onNavigate, onSelectQuest, onCreateQuest }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [sortBy, setSortBy] = useState<'default' | 'deadline'>('default');

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('tasktribe_tutorial_completed');
    if (!hasSeenTutorial && !user.isAdult) {
      setShowTutorial(true);
    }
  }, [user.isAdult]);

  const handleTutorialEnd = () => {
    localStorage.setItem('tasktribe_tutorial_completed', 'true');
    setShowTutorial(false);
  };
  
  const handleTutorialNext = () => {
    if (tutorialStep === 5) {
      handleTutorialEnd();
    } else {
      setTutorialStep(prev => prev + 1);
    }
  };

  const sortedQuests = useMemo(() => {
    const openQuests = quests.filter(q => q.status === 'OPEN');
    if (sortBy === 'deadline') {
        return [...openQuests].sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
    }
    return openQuests;
  }, [quests, sortBy]);

  const xpForNextLevel = 1000 * user.level;
  const xpProgress = (user.xp / xpForNextLevel) * 100;

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-20">
      {showTutorial && <WelcomeTutorial step={tutorialStep} onNext={handleTutorialNext} onSkip={handleTutorialEnd} />}

      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-800">
         <div id="tutorial-profile" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-white">Lvl {user.level}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button><SearchIcon className="w-6 h-6 text-gray-400" /></button>
          <button className="relative">
            <BellIcon className="w-6 h-6 text-gray-400" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-purple-500 ring-2 ring-gray-900"></span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-8">
        <section id="tutorial-xp" className="bg-gray-800 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-gray-300">Level {user.level} - {user.isAdult ? 'Pro' : 'Newbie'}</span>
                <span className="font-semibold">{user.xp} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${xpProgress}%` }}></div>
            </div>
             <p className="text-xs text-gray-400 mt-2">{user.isAdult ? 'Welcome back!' : 'Complete your first quest to start earning!'}</p>
        </section>

        <section className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-xl text-center">
            <h2 className="text-lg font-bold">👋 Hi {user.username}! Ready for a quest?</h2>
            <button onClick={() => onNavigate('quests')} className="mt-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-full text-sm">Find Quests for Me</button>
        </section>

        <section id="tutorial-quests">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">Featured Quests</h2>
            <div className="flex items-center gap-2">
                <SortPill label="Latest" isActive={sortBy === 'default'} onClick={() => setSortBy('default')} />
                <SortPill label="Deadline" isActive={sortBy === 'deadline'} onClick={() => setSortBy('deadline')} />
            </div>
          </div>
          <div className="space-y-4">
            {sortedQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} onSelect={() => onSelectQuest(quest)} currentUser={user} />
            ))}
          </div>
        </section>

        {!user.isTribeMember && (
          <section id="tutorial-tribes">
            <h2 className="text-xl font-bold mb-3">Discover Tribes</h2>
             <p className="text-sm text-gray-400 mb-4">Don't go alone! Join a tribe.</p>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {mockTribes.map(tribe => (
                  <div key={tribe.name} className="flex-shrink-0 w-40 bg-gray-800 p-4 rounded-xl text-center">
                      <div className="text-4xl mb-2">{tribe.icon}</div>
                      <p className="font-bold">{tribe.name}</p>
                      <p className="text-xs text-gray-400">{tribe.members} | {tribe.level}</p>
                      <button onClick={() => onNavigate('tribes')} className="mt-3 w-full bg-purple-600/50 hover:bg-purple-600/80 text-white text-sm font-semibold py-1.5 px-3 rounded-full">Join</button>
                  </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {user.isAdult && (
        <button 
          onClick={onCreateQuest}
          className="fixed bottom-20 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-4 rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-2 animate-scale-up"
        >
            <PencilAltIcon className="w-6 h-6" />
            <span className="hidden sm:block">Post a Quest</span>
        </button>
      )}

      <BottomNavBar activeTab="home" onNavigate={onNavigate} />
    </div>
  );
};

export default HomeScreen;