

import React from 'react';
import { UserCircleIcon, PlusIcon } from '../components/common/Icons';

interface ProfileSetupScreenProps {
  onComplete: () => void;
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onComplete }) => {
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <p className="text-gray-400">Step 4 of 4</p>
            <h1 className="text-3xl font-bold text-white">Setup Your Professional Profile</h1>
            <p className="text-gray-400 mt-2">This will be visible to clients and other users.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
                <div className="relative">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-16 h-16 text-gray-500" />
                    </div>
                    <button type="button" className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full">
                        <PlusIcon className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>

            <input type="text" placeholder="Professional Headline (e.g., 'Graphic Designer & Illustrator')" className="w-full bg-gray-800 border-gray-700 rounded-lg px-4 py-3" />
            <textarea placeholder="Bio / Summary (Tell everyone about your experience and what you do best)" rows={4} className="w-full bg-gray-800 border-gray-700 rounded-lg px-4 py-3"></textarea>
            <input type="text" placeholder="Skills (comma-separated, e.g., Figma, React, Copywriting)" className="w-full bg-gray-800 border-gray-700 rounded-lg px-4 py-3" />
            <input type="url" placeholder="Portfolio or LinkedIn URL (Optional)" className="w-full bg-gray-800 border-gray-700 rounded-lg px-4 py-3" />
            
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors duration-200">
                Complete Profile
            </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;