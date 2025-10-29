import React, { useState } from 'react';
import Spinner from '../components/common/Spinner';

interface AdultSignupScreenProps {
  onSignup: (email: string) => void;
}

const AdultSignupScreen: React.FC<AdultSignupScreenProps> = ({ onSignup }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email && password && agreed) {
        setIsLoading(true);
        try {
            await onSignup(email);
        } catch (error) {
            console.error("Signup failed", error);
            setIsLoading(false);
        }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <p className="text-gray-400">Step 1 of 4</p>
            <h1 className="text-3xl font-bold text-white">Create Your Professional Account</h1>
            <span className="inline-block bg-indigo-600/50 text-indigo-200 text-sm font-semibold px-3 py-1 rounded-full mt-2">Adult Earner (18+)</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
            
            <div className="flex items-start space-x-3 text-sm">
                <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 bg-gray-800 border-gray-600 rounded text-indigo-500 focus:ring-indigo-600"/>
                <label htmlFor="terms" className="text-gray-400">I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>.</label>
            </div>

            <div className="bg-blue-900/50 text-blue-200 text-sm rounded-lg p-3 text-center">
             🔒 You'll need to complete identity verification to start earning.
            </div>

            <button type="submit" disabled={!fullName || !email || !password || !agreed || isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-700 flex justify-center items-center">
                {isLoading ? <Spinner /> : 'Create Account & Continue'}
            </button>
        </form>
         <p className="mt-6 text-center text-sm">
            <a href="#" className="text-gray-400">Already have an account? <span className="text-indigo-400 font-semibold hover:underline">Log In</span></a>
        </p>
      </div>
    </div>
  );
};

export default AdultSignupScreen;