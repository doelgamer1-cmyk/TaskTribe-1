import React from 'react';
import { ShieldIcon } from '../components/common/Icons';

const VerificationInProgressScreen: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-center">
            <div className="relative flex justify-center items-center mb-8">
                <div className="absolute w-24 h-24 bg-purple-500/20 rounded-full animate-ping"></div>
                <ShieldIcon className="w-20 h-20 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verifying Submission...</h1>
            <p className="text-gray-400 max-w-sm">
                Our AI moderator is reviewing your work to ensure it meets the quest requirements. This helps prevent scams and keeps the platform fair for everyone.
            </p>
            <p className="text-gray-500 mt-4 text-sm">This usually only takes a moment.</p>
        </div>
    );
};

export default VerificationInProgressScreen;
