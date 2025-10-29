import React, { useState } from 'react';
import { ShieldIcon } from '../components/common/Icons';
import Spinner from '../components/views/Spinner';

interface GuardianVerificationScreenProps {
  onVerify: (phone: string) => void;
}

const GuardianVerificationScreen: React.FC<GuardianVerificationScreenProps> = ({ onVerify }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length > 9) {
        setIsLoading(true);
        try {
            await onVerify(phone);
        } catch (error) {
            console.error("Verification failed", error);
            setIsLoading(false);
        }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
            <ShieldIcon className="h-20 w-20 text-purple-400 animate-pulse"/>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">Guardian Verification Required</h1>
        <p className="text-gray-400 mb-8">For your safety, a parent or guardian needs to verify your account.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Guardian's Phone Number"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-lg text-center text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="text-left bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-2 text-sm text-gray-300">
             <p className="font-semibold text-white">By verifying, your guardian agrees:</p>
             <p>✓ I consent to my child using TaskTribe</p>
             <p>✓ I will monitor their activity</p>
             <p>✓ No money transfers until age 18</p>
             <p>✓ I can pause account anytime</p>
          </div>
          
          <button
            type="submit"
            disabled={phone.trim().length <= 9 || isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <Spinner /> : 'Send Verification to Guardian'}
          </button>
        </form>
        <p className="mt-6 text-sm">
            <a href="#" className="text-purple-400 hover:underline">Guardian has questions?</a>
        </p>
      </div>
    </div>
  );
};

export default GuardianVerificationScreen;