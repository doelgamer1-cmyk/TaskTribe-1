import React, { useState, useMemo } from 'react';
import Spinner from '../components/common/Spinner';

interface TeenSignupScreenProps {
  onSignup: (username: string, phone: string) => void;
}

const TeenSignupScreen: React.FC<TeenSignupScreenProps> = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (password.length > 7) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && phone.trim()) {
        setIsLoading(true);
        try {
            await onSignup(username, phone);
        } catch (error) {
            console.error("Signup failed", error);
            setIsLoading(false);
        }
    }
  };

  const getStrengthColor = (level: number) => {
    if (passwordStrength >= level) {
      if (passwordStrength === 1) return 'bg-red-500';
      if (passwordStrength === 2) return 'bg-yellow-500';
      if (passwordStrength === 3) return 'bg-blue-500';
      if (passwordStrength === 4) return 'bg-green-500';
    }
    return 'bg-gray-700';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <p className="text-gray-400">Step 1 of 3</p>
            <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
            <span className="inline-block bg-purple-600/50 text-purple-200 text-sm font-semibold px-3 py-1 rounded-full mt-2">Teen Learner (13-17)</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="text" onFocus={(e) => e.target.type='date'} onBlur={(e) => e.target.type='text'} placeholder="Date of Birth" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="tel" placeholder="Your Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            
            <div>
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                />
                <div className="flex space-x-1 mt-2 h-1">
                    <div className={`w-1/4 rounded-full transition-colors ${getStrengthColor(1)}`}></div>
                    <div className={`w-1/4 rounded-full transition-colors ${getStrengthColor(2)}`}></div>
                    <div className={`w-1/4 rounded-full transition-colors ${getStrengthColor(3)}`}></div>
                    <div className={`w-1/4 rounded-full transition-colors ${getStrengthColor(4)}`}></div>
                </div>
            </div>

            <div className="flex items-start space-x-3 text-sm">
                <input type="checkbox" id="terms" className="mt-1 bg-gray-800 border-gray-600 rounded text-purple-500 focus:ring-purple-600"/>
                <label htmlFor="terms" className="text-gray-400">I agree to <a href="#" className="text-purple-400 hover:underline">Terms & Teen Policy</a></label>
            </div>

            <div className="bg-blue-900/50 text-blue-200 text-sm rounded-lg p-3 text-center">
             First, we'll verify your number, then your guardian's for safety.
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 flex justify-center items-center">
                {isLoading ? <Spinner /> : 'Continue'}
            </button>
        </form>
         <p className="mt-6 text-center text-sm">
            <a href="#" className="text-gray-400">Already have an account? <span className="text-purple-400 font-semibold hover:underline">Log In</span></a>
        </p>
      </div>
    </div>
  );
};

export default TeenSignupScreen;