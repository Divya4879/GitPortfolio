import React from 'react';
import { industryAnalysis } from '../services/industryAnalysis';
import { ArrowRightIcon, TrendingUpIcon, DollarSignIcon } from './icons';

interface IndustryInsightsProps {
  targetRole: string;
  experienceLevel: string;
  detectedTechnologies: string[];
  overallScore: number;
}

const IndustryInsights: React.FC<IndustryInsightsProps> = ({
  targetRole,
  experienceLevel,
  detectedTechnologies,
  overallScore
}) => {
  const roleInsights = industryAnalysis.getRoleInsights(targetRole);
  const techDemand = industryAnalysis.getTechDemand(detectedTechnologies);
  const salaryInsights = industryAnalysis.getSalaryInsights(targetRole, experienceLevel);
  const marketPosition = industryAnalysis.getMarketPosition(targetRole, overallScore);

  if (!roleInsights) return null;

  const formatSalary = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400 bg-green-900/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'High': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-6">Industry Insights</h3>
      
      {/* Market Position */}
      <div className="mb-6 p-4 bg-black/20 rounded-lg border border-purple-500/20">
        <h4 className="text-lg font-medium text-purple-200 mb-2">Your Market Position</h4>
        <p className="text-white text-lg font-semibold">{marketPosition}</p>
        <p className="text-gray-300 text-sm mt-1">
          Based on your portfolio score of {overallScore}/100 for {targetRole} roles
        </p>
      </div>

      {/* Role Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSignIcon className="w-5 h-5 text-green-400" />
            <h4 className="font-medium text-purple-200">Salary Range</h4>
          </div>
          <div className="space-y-1">
            <p className="text-white font-semibold">{formatSalary(salaryInsights.avg)}</p>
            <p className="text-gray-400 text-sm">
              {formatSalary(salaryInsights.min)} - {formatSalary(salaryInsights.max)}
            </p>
            <p className="text-gray-500 text-xs">For {experienceLevel} level</p>
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUpIcon className="w-5 h-5 text-blue-400" />
            <h4 className="font-medium text-purple-200">Job Market</h4>
          </div>
          <div className="space-y-1">
            <p className="text-white font-semibold">{roleInsights.jobOpenings.toLocaleString()} openings</p>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${getCompetitionColor(roleInsights.competitionLevel)}`}>
                {roleInsights.competitionLevel} Competition
              </span>
            </div>
            <p className="text-gray-400 text-sm">{roleInsights.growthProjection}</p>
          </div>
        </div>
      </div>

      {/* Technology Demand */}
      {techDemand.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-purple-200 mb-4">Your Tech Stack Market Value</h4>
          <div className="space-y-3">
            {techDemand.slice(0, 4).map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">{tech.technology}</span>
                  <span className="text-green-400 text-sm">{tech.jobGrowth} growth</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{formatSalary(tech.averageSalary)}</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      tech.demandScore >= 90 ? 'bg-green-400' : 
                      tech.demandScore >= 80 ? 'bg-yellow-400' : 'bg-gray-400'
                    }`} />
                    <span className="text-gray-400 text-xs">Demand: {tech.demandScore}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Companies */}
      {techDemand.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-purple-200 mb-3">Companies Using Your Skills</h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(techDemand.flatMap(t => t.companies))).slice(0, 8).map((company, index) => (
              <span key={index} className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm">
                {company}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryInsights;
