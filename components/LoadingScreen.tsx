import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  currentStep?: string;
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ currentStep, progress = 0 }) => {
  const [dots, setDots] = useState('');
  
  const steps = [
    'Authenticating with GitHub...',
    'Fetching your repositories...',
    'Analyzing code quality...',
    'Extracting skills and technologies...',
    'Generating recommendations...',
    'Finalizing your report...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const currentStepText = currentStep || steps[Math.floor((progress / 100) * steps.length)] || steps[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-white">PP</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progress, 10)}%` }}
            />
          </div>
          <p className="text-purple-200 text-sm">{Math.round(progress)}% Complete</p>
        </div>

        {/* Current Step */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Analyzing Your Portfolio
        </h2>
        <p className="text-purple-300 text-lg mb-8">
          {currentStepText}{dots}
        </p>

        {/* Steps List */}
        <div className="text-left space-y-2">
          {steps.map((step, index) => {
            const stepProgress = (progress / 100) * steps.length;
            const isCompleted = stepProgress > index;
            const isCurrent = Math.floor(stepProgress) === index;
            
            return (
              <div key={index} className={`flex items-center space-x-3 ${
                isCompleted ? 'text-green-400' : isCurrent ? 'text-purple-300' : 'text-gray-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isCompleted ? 'bg-green-400' : isCurrent ? 'bg-purple-400 animate-pulse' : 'bg-gray-600'
                }`} />
                <span className="text-sm">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-8 p-4 bg-black/20 rounded-lg border border-purple-500/20">
          <p className="text-purple-200 text-sm">
            💡 <strong>Tip:</strong> We're analyzing your repositories to provide personalized insights for your target role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
