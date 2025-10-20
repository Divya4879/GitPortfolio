import React from 'react';

interface ProgressBarProps {
  score: number;
  label: string;
  benchmark?: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  score, 
  label, 
  benchmark = 70,
  color = "purple" 
}) => {
  const percentage = Math.min(score, 100);
  const benchmarkPosition = Math.min(benchmark, 100);
  
  const getColorClasses = () => {
    if (score >= benchmark) return "bg-green-500";
    if (score >= benchmark * 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-purple-200">{label}</span>
        <span className="text-sm text-purple-300">{score}/100</span>
      </div>
      <div className="relative w-full bg-gray-700 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${getColorClasses()}`}
          style={{ width: `${percentage}%` }}
        />
        {benchmark && (
          <div 
            className="absolute top-0 w-0.5 h-3 bg-white opacity-60"
            style={{ left: `${benchmarkPosition}%` }}
            title={`Industry benchmark: ${benchmark}`}
          />
        )}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Poor</span>
        <span>Industry Avg ({benchmark})</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

export default ProgressBar;
