
import React from 'react';
// Fix: Corrected the import path for the 'Tribe' type.
import { Tribe } from '../types';
import { ArrowLeftIcon, TrophyIcon, LightningBoltIcon, TeamIcon } from '../components/common/Icons';

interface TribeWarScreenProps {
    tribe: Tribe;
    onEndWar: () => void;
}

const LeaderboardItem: React.FC<{rank: number, icon: string, name: string, xp: string, isUserTribe?: boolean}> = ({rank, icon, name, xp, isUserTribe}) => (
    <div className={`flex items-center p-3 rounded-lg ${isUserTribe ? 'bg-purple-600/30 border border-purple-500' : 'bg-gray-800/50'}`}>
        <span className={`w-6 text-center font-bold ${rank <= 3 ? 'text-yellow-300' : 'text-gray-400'}`}>{rank}</span>
        <img src={icon} alt={name} className="w-10 h-10 rounded-lg mx-3" />
        <div className="flex-grow">
            <p className="font-semibold text-white">{name}</p>
            {rank === 1 && <p className="text-xs text-yellow-400">🥇 Gold Medal</p>}
        </div>
        <p className="font-bold text-lg text-white">{xp} XP</p>
    </div>
);

const MissionCard: React.FC<{title: string, reward: string, icon: React.ReactNode, progress?: string}> = ({title, reward, icon, progress}) => (
    <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-600/30 rounded-lg">{icon}</div>
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-purple-300 font-semibold">{reward}</p>
                 {progress && <p className="text-xs text-gray-400 mt-1">{progress}</p>}
            </div>
        </div>
        <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg text-sm">
            {progress ? 'Contribute' : 'Start Mission'}
        </button>
    </div>
)

const TribeWarScreen: React.FC<TribeWarScreenProps> = ({ tribe, onEndWar }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-white pb-24">
            <header className="p-4 flex justify-between items-center border-b border-gray-800">
                <button onClick={onEndWar} className="p-2 -ml-2"><ArrowLeftIcon className="w-6 h-6"/></button>
                <h1 className="text-xl font-bold">Weekend War #48</h1>
                <button className="p-2 -mr-2"><TrophyIcon className="w-6 h-6"/></button>
            </header>

            <div className="p-4 m-4 bg-gradient-to-r from-purple-900/50 to-red-800/50 rounded-xl text-center border border-red-500/50 animate-pulse">
                <p className="text-sm text-red-300">War ends in</p>
                <p className="text-4xl font-bold tracking-widest">14:23:08</p>
            </div>
            
            <main className="px-4 space-y-6">
                 <section>
                    <h3 className="font-bold text-lg mb-2">Live Rankings</h3>
                    <div className="space-y-2">
                        <LeaderboardItem rank={1} icon="https://placehold.co/40x40/FFC107/000000?text=CC" name="Code Crushers" xp="4,890"/>
                        <LeaderboardItem rank={2} icon="https://placehold.co/40x40/C0C0C0/000000?text=EW" name="Eco Warriors" xp="4,102"/>
                        <LeaderboardItem rank={3} icon="https://placehold.co/40x40/CD7F32/000000?text=TT" name="Tech Titans" xp="3,756"/>
                        <LeaderboardItem rank={5} icon={tribe.iconUrl} name={tribe.name} xp="2,340" isUserTribe/>
                    </div>
                </section>
                
                 <section>
                    <h3 className="font-bold text-lg mb-2">Bonus Missions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MissionCard title="Speed Run: Complete 5 tasks in 3 hours" reward="+200 tribe XP" icon={<LightningBoltIcon className="w-6 h-6 text-purple-300" />} />
                        <MissionCard title="Tribe Unity: 30 members complete 1 task each" reward="+500 tribe XP" icon={<TeamIcon className="w-6 h-6 text-purple-300" />} progress="18/30 Complete" />
                    </div>
                </section>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg text-center">
                    Find 2× XP Quests
                </button>
            </div>
        </div>
    );
};

export default TribeWarScreen;