import React, { useState, useEffect } from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);
  
  const size = 180;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    let animationFrameId: number;
    const animateScore = (timestamp: number) => {
        setDisplayScore(currentScore => {
            if (currentScore < score) {
                const nextScore = currentScore + 1;
                animationFrameId = requestAnimationFrame(animateScore);
                return nextScore > score ? score : nextScore;
            }
            return score;
        });
    };
    animationFrameId = requestAnimationFrame(animateScore);
    return () => cancelAnimationFrame(animationFrameId);
  }, [score]);


  const getScoreColor = (s: number) => {
    if (s < 40) return 'text-red-400';
    if (s < 70) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  const getScoreLabel = (s: number) => {
    if (s < 40) return 'Needs Improvement';
    if (s < 70) return 'Solid Foundation';
    return 'Excellent';
  };

  const getTrackColor = (s: number) => {
    if (s < 40) return 'stroke-red-500';
    if (s < 70) return 'stroke-yellow-500';
    return 'stroke-green-500';
  };

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="text-gray-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${getTrackColor(score)} transition-all duration-1000 ease-out`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
          {displayScore}
        </span>
        <span className={`text-sm font-semibold mt-1 ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
};

export default ScoreGauge;