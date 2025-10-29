
import React from 'react';
import { GraduationCapIcon, BriefcaseIcon } from '../components/common/Icons';

interface AgeSelectionScreenProps {
  onSelectTeen: () => void;
  onSelectAdult: () => void;
}

const AgeSelectionCard: React.FC<{
    icon: React.ReactNode, 
    title: string, 
    subtitle: string, 
    features: string[], 
    onClick: () => void,
    isTeen?: boolean
}> = ({ icon, title, subtitle, features, onClick, isTeen }) => (
    <button 
        onClick={onClick}
        className={`w-full max-w-sm text-left bg-gray-800 border border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-600/20 hover:-translate-y-2 ${isTeen ? 'shadow-lg shadow-purple-600/20 border-purple-600' : ''}`}
    >
        <div className="flex items-center space-x-4 mb-4">
            <div className={`p-3 rounded-lg ${isTeen ? 'bg-purple-600' : 'bg-indigo-600'}`}>
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="text-gray-400">{subtitle}</p>
            </div>
        </div>
        <ul className="space-y-2 text-gray-300 pl-2">
            {features.map(feature => <li key={feature} className="before:content-['•'] before:mr-2 before:text-purple-400">{feature}</li>)}
        </ul>
    </button>
);


const AgeSelectionScreen: React.FC<AgeSelectionScreenProps> = ({ onSelectTeen, onSelectAdult }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-indigo-900/50">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white">Welcome! How old are you?</h1>
      </div>
      <div className="flex flex-col items-center space-y-6 w-full">
        <AgeSelectionCard 
            icon={<GraduationCapIcon className="h-8 w-8 text-white"/>}
            title="I'm 13-17 years old"
            subtitle="Learn & Build Skills"
            features={["Safe, educational tasks", "Earn Skill Points", "Convert to ₹ at 18"]}
            onClick={onSelectTeen}
            isTeen
        />
        <AgeSelectionCard 
            icon={<BriefcaseIcon className="h-8 w-8 text-white"/>}
            title="I'm 18+ years old"
            subtitle="Earn Real Money"
            features={["Get paid instantly", "All task categories", "Join tribe wars"]}
            onClick={onSelectAdult}
        />
      </div>
    </div>
  );
};

export default AgeSelectionScreen;