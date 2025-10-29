import React, { useEffect, useState } from 'react';

interface WelcomeTutorialProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({ step, onNext, onSkip }) => {
  // Fix: Added 'height' to the initial state to match the shape of the object used for updates.
  const [position, setPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'auto', height: 'auto' });
  const [tooltipPosition, setTooltipPosition] = useState({ top: '0', left: '0', transform: 'translateX(-50%)' });

  const steps = [
    {
      targetId: 'tutorial-xp',
      title: 'This is your XP!',
      text: 'Complete tasks to level up 🚀',
      align: 'bottom'
    },
    {
      // Fix: Changed targetId to 'tutorial-quests' to match the actual element ID in HomeScreen.
      targetId: 'tutorial-quests',
      title: 'These are Quests',
      text: "Fun tasks you can do to earn Skill Points. Tap 'View Quest' or 'Bid Now' to get started!",
      align: 'bottom'
    },
    {
      targetId: 'tutorial-tribes',
      title: 'Join a Tribe!',
      text: 'Team up with friends and compete! 🏆',
      align: 'top'
    },
    {
      targetId: 'tutorial-profile',
      title: 'Build your profile',
      text: 'Build your profile with badges and skills.',
      align: 'bottom-left'
    },
    {
      targetId: 'tutorial-profile', // Reusing profile for Vault concept
      title: 'Your Vault stores Skill Points 💰',
      text: 'When you turn 18, you can convert them to real money!',
      align: 'bottom-left'
    }
  ];

  const currentStep = steps[step - 1];
  
  useEffect(() => {
    const target = document.getElementById(currentStep.targetId);
    if (target) {
      const rect = target.getBoundingClientRect();
      // Fix: Added 'transform' property to match the state's shape and ensure smooth transition.
      const newPos = {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        transform: 'none'
      };
      
      let newTooltipPos = { top: '0', left: '50%', transform: 'translateX(-50%)' };
      if (currentStep.align === 'bottom') {
        newTooltipPos.top = `${rect.bottom + 10}px`;
      } else if (currentStep.align === 'top') {
        newTooltipPos.top = `${rect.top - 10}px`;
        newTooltipPos.transform = 'translate(-50%, -100%)';
      } else if (currentStep.align === 'bottom-left') {
        newTooltipPos.top = `${rect.bottom + 10}px`;
        newTooltipPos.left = `${rect.left}px`;
        newTooltipPos.transform = 'translateX(0)';
      }
      setTooltipPosition(newTooltipPos);
      setPosition(newPos);
    }
  }, [step, currentStep.targetId, currentStep.align]);

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Spotlight */}
      <div
        className="absolute rounded-lg border-2 border-purple-500 border-dashed shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] transition-all duration-300"
        style={position}
      ></div>

      {/* Tooltip */}
      <div
        className="absolute p-4 bg-gray-800 rounded-lg max-w-xs border border-gray-700 transition-all duration-300 animate-fade-in"
        style={tooltipPosition}
      >
        <h4 className="font-bold text-lg mb-1">{currentStep.title}</h4>
        <p className="text-sm text-gray-300 mb-4">{currentStep.text}</p>
        <div className="flex justify-between items-center">
            <button onClick={onSkip} className="text-xs text-gray-500 hover:text-white">Skip tutorial</button>
            <button onClick={onNext} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-4 rounded-full">
                {step === 5 ? "Let's Start" : "Next"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTutorial;
