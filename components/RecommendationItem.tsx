
import React from 'react';
import type { Recommendation } from '../types';
import { BookOpenIcon, CodeBracketIcon, ChartBarIcon, RectangleStackIcon, BriefcaseIcon } from './icons';

interface RecommendationItemProps {
  recommendation: Recommendation;
  index: number;
}

const categoryDetails: { [key in Recommendation['category']]: { icon: React.FC<any>, color: string } } = {
  'Documentation': { icon: BookOpenIcon, color: 'text-blue-400' },
  'Code Quality': { icon: CodeBracketIcon, color: 'text-purple-400' },
  'Project Diversity': { icon: ChartBarIcon, color: 'text-green-400' },
  'Tech Stack': { icon: RectangleStackIcon, color: 'text-teal-400' },
  'Professionalism': { icon: BriefcaseIcon, color: 'text-indigo-400' },
};

const RecommendationItem: React.FC<RecommendationItemProps> = ({ recommendation, index }) => {
  const priorityStyles = {
    High: {
      bg: 'bg-red-900/30',
      text: 'text-red-300',
      border: 'border-red-700/50',
      label: 'text-red-300 font-semibold',
      badgeBg: 'bg-red-500/20',
      shadow: 'hover:shadow-red-900/40'
    },
    Medium: {
      bg: 'bg-yellow-900/30',
      text: 'text-yellow-300',
      border: 'border-yellow-700/50',
      label: 'text-yellow-300 font-semibold',
      badgeBg: 'bg-yellow-500/20',
      shadow: 'hover:shadow-yellow-900/40'
    },
    Low: {
      bg: 'bg-blue-900/30',
      text: 'text-blue-300',
      border: 'border-blue-700/50',
      label: 'text-blue-300 font-semibold',
      badgeBg: 'bg-blue-500/20',
      shadow: 'hover:shadow-blue-900/40'
    },
  };

  const styles = priorityStyles[recommendation.priority];
  const CategoryIcon = categoryDetails[recommendation.category]?.icon || BookOpenIcon;
  const categoryColor = categoryDetails[recommendation.category]?.color || 'text-gray-400';

  return (
    <div 
        className={`p-4 rounded-lg border ${styles.border} ${styles.bg} transition-all duration-300 transform opacity-0 animate-fade-in-up hover:shadow-lg ${styles.shadow}`}
        style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="font-semibold text-white">{recommendation.title}</h4>
        <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-gray-900/50 border border-gray-700 ${categoryColor}`}>
                <CategoryIcon className="w-3.5 h-3.5" />
                {recommendation.category}
            </span>
            <span className={`text-xs uppercase px-2 py-1 rounded-md ${styles.badgeBg} ${styles.label}`}>
              {recommendation.priority} Priority
            </span>
        </div>
      </div>
      <p className={`text-sm ${styles.text}`}>
        {recommendation.description}
      </p>
    </div>
  );
};

export default RecommendationItem;