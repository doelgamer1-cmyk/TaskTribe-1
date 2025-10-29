import React, { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Increased duration for the new animation
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-blue-900">
      <div className="text-center">
        <div className="text-6xl font-bold text-white flex items-end">
          <span className="animate-logo-t">T</span>
          <span className="animate-logo-extend">askTribe</span>
        </div>
        <p className="text-xl text-gray-300 mt-4 animate-tagline-fade-in">
          Learn, Earn, and Belong
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;