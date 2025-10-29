
import React from 'react';
import { HomeIcon, CompassIcon, ShieldIcon, UserCircleIcon } from './Icons';

type NavView = 'home' | 'quests' | 'tribes' | 'profile';

interface BottomNavBarProps {
  activeTab: NavView;
  onNavigate: (view: NavView) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>
    {icon}
    <span className={`text-xs mt-1 font-medium ${isActive ? 'text-purple-400' : 'text-gray-500'}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 flex z-50">
      <NavItem icon={<HomeIcon className="h-6 w-6" />} label="Home" isActive={activeTab === 'home'} onClick={() => onNavigate('home')} />
      <NavItem icon={<CompassIcon className="h-6 w-6" />} label="Quests" isActive={activeTab === 'quests'} onClick={() => onNavigate('quests')} />
      <NavItem icon={<ShieldIcon className="h-6 w-6" />} label="Tribes" isActive={activeTab === 'tribes'} onClick={() => onNavigate('tribes')} />
      <NavItem icon={<UserCircleIcon className="h-6 w-6" />} label="Profile" isActive={activeTab === 'profile'} onClick={() => onNavigate('profile')} />
    </div>
  );
};

export default BottomNavBar;