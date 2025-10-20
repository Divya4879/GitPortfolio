import React from 'react';

interface AnalysisCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, icon, children, noPadding = false }) => {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col transition-all duration-300 hover:border-purple-600/50 hover:shadow-lg hover:shadow-purple-900/20">
      <div className="flex items-center gap-3 p-4 border-b border-gray-700/50 flex-shrink-0">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className={`${!noPadding && 'p-4 sm:p-6'} flex-grow`}>{children}</div>
    </div>
  );
};

export default AnalysisCard;