
import React from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { LOADING_MESSAGES } from '../constants';

const LoadingSpinner: React.FC = () => (
    <div className="w-16 h-16 border-4 border-t-purple-400 border-r-purple-400 border-gray-700 rounded-full animate-spin"></div>
);


const LoadingScreen: React.FC = () => {
    const typedMessage = useTypingEffect(LOADING_MESSAGES);
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <LoadingSpinner />
      <h2 className="text-2xl font-bold mt-8 text-gray-200">Analyzing Portfolio</h2>
      <p className="text-gray-400 mt-2 h-6">
        {typedMessage}
        <span className="animate-pulse">|</span>
      </p>
    </div>
  );
};

export default LoadingScreen;
