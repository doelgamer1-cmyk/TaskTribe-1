
import React, { useState, useEffect, useRef } from 'react';
import { PhoneIcon } from '../components/common/Icons';

interface VerificationPendingScreenProps {
  guardianPhone: string;
  onComplete: () => void;
}

const VerificationPendingScreen: React.FC<VerificationPendingScreenProps> = ({ guardianPhone, onComplete }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  
  // Auto-verify on completion for demo
  useEffect(() => {
      if (otp.every(val => val !== '')) {
          const timeout = setTimeout(onComplete, 500);
          return () => clearTimeout(timeout);
      }
  }, [otp, onComplete])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    // Allow only single digit numbers
    if (/^[0-9]?$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Move to next input if a digit is entered
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current is empty
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

  const isComplete = otp.every(val => val !== '');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
            <PhoneIcon />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Verification Sent!</h1>
        <p className="text-gray-400 mb-8">
            We've sent an OTP to {guardianPhone}.<br/>
            Ask your guardian to check their messages.
        </p>

        <div className="flex justify-center space-x-3 mb-6" onPaste={handlePaste}>
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
                    className="w-14 h-16 bg-slate-800 border border-slate-700 rounded-xl text-center text-3xl font-semibold text-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition"
                />
            ))}
        </div>
        
        {isComplete ? (
            <p className="text-green-400 font-semibold">Verified! ✓</p>
        ) : (
            <p className="text-sm text-gray-500">
                {timer > 0 ? `Resend OTP in 0:${timer.toString().padStart(2, '0')}` : <button onClick={() => setTimer(45)} className="text-purple-400 hover:underline">Resend OTP</button>}
            </p>
        )}

        <button
            onClick={onComplete}
            disabled={!isComplete}
            className="w-full mt-8 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3.5 rounded-lg transition-colors duration-200 disabled:bg-slate-800 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
            Verify & Continue
        </button>
      </div>
    </div>
  );
};

export default VerificationPendingScreen;