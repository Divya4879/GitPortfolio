import React from 'react';

interface ProgressBarProps {
  score: number;
  label: string;
  benchmark: number;
  interpretation?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  score, 
  label, 
  benchmark,
  interpretation,
  color = "purple" 
}) => {
  const percentage = Math.min(score, 100);
  const benchmarkPosition = Math.min(benchmark, 100);
  
  const getColorClasses = () => {
    if (score >= benchmark + 10) return "bg-green-500";
    if (score >= benchmark) return "bg-blue-500";
    if (score >= benchmark - 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPerformanceLevel = () => {
    if (score >= benchmark + 15) return "Excellent";
    if (score >= benchmark + 5) return "Above Average";
    if (score >= benchmark - 5) return "Average";
    if (score >= benchmark - 15) return "Below Average";
    return "Needs Work";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-purple-200">{label}</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-purple-300">{score}/100</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            score >= benchmark ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'
          }`}>
            {getPerformanceLevel()}
          </span>
        </div>
      </div>
      
      <div className="relative w-full bg-gray-700 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${getColorClasses()}`}
          style={{ width: `${percentage}%` }}
        />
        {benchmark && (
          <div 
            className="absolute top-0 w-0.5 h-3 bg-white opacity-80"
            style={{ left: `${benchmarkPosition}%` }}
            title={`Industry benchmark: ${benchmark}`}
          />
        )}
      </div>
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>0</span>
        <span className="text-white font-medium">Industry Avg: {benchmark}</span>
        <span>100</span>
      </div>
      
      {interpretation && (
        <p className="text-xs text-gray-300 italic">{interpretation}</p>
      )}
    </div>
  );
};

export default ProgressBar;
