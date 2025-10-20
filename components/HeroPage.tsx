import React from 'react';
import { ArrowRightIcon } from './icons';

interface HeroPageProps {
  onGetStarted: () => void;
}

const HeroPage: React.FC<HeroPageProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center animate-fade-in-up">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
          PortfolioPilot
        </span>
      </h1>
      <h2 className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl">
        Go beyond line counts. Get a deep, AI-driven analysis of your GitHub portfolio and a personalized roadmap to impress top-tier recruiters.
      </h2>
      <button
        onClick={onGetStarted}
        className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-900/30"
      >
        Start Your Free Analysis
        <ArrowRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HeroPage;