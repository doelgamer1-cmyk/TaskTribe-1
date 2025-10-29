import React, { useState, useEffect, useRef } from 'react';
import { PhoneIcon } from '../components/common/Icons';

interface OTPScreenProps {
  verificationTarget: string;
  onVerify: () => void;
  onBack: () => void;
  expectedOtp: string | null;
}

const OTPScreen: React.FC<OTPScreenProps> = ({ verificationTarget, onVerify, onBack, expectedOtp }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    setError(null);
    if (/^[0-9]?$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
        inputsRef.current[index - 1]?.focus();
    }
  }
  
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (pasteData.length === 6) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputsRef.current[5]?.focus();
    }
  };
  
  const handleSubmit = () => {
      const enteredOtp = otp.join('');
      if (enteredOtp === expectedOtp) {
          setError(null);
          onVerify();
      } else {
          setError("Invalid code. Please try again.");
      }
  }

  const isComplete = otp.every(val => val !== '');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center">
            <div className="flex justify-center mb-8">
                <PhoneIcon />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Check Your Device</h1>
            <p className="text-gray-400 mb-8">
                We sent a 6-digit verification code to <br/>
                <span className="font-semibold text-white">{verificationTarget}</span>
            </p>
        </div>
        
        <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm rounded-lg p-3 text-center mb-6">
            <p className="font-bold">DEMO NOTE</p>
            <p>We can't send a real email or SMS. Your verification code has been printed to the browser's developer console.</p>
        </div>

        <div className="flex justify-center space-x-2 md:space-x-3 mb-6" onPaste={handlePaste}>
            {otp.map((value, index) => (
                <input
                    key={index}
                    ref={el => { inputsRef.current[index] = el }}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-12 h-14 md:w-14 md:h-16 bg-gray-800 border rounded-xl text-center text-3xl font-semibold text-white focus:outline-none focus:ring-1 transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-purple-500'}`}
                />
            ))}
        </div>
        
        {error && <p className="text-center text-red-400 text-sm mb-4">{error}</p>}
        
        <p className="text-sm text-center text-gray-500">
            {timer > 0 ? `Resend code in 0:${timer.toString().padStart(2, '0')}` : <button onClick={() => setTimer(45)} className="text-purple-400 hover:underline">Resend Code</button>}
        </p>

        <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
            Verify
        </button>
        <button onClick={onBack} className="w-full mt-3 text-gray-400 text-sm hover:text-white">
            Go Back
        </button>
      </div>
    </div>
  );
};

export default OTPScreen;