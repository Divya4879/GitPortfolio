import React from 'react';
import { ArrowRightIcon, GitHubIcon } from './icons';

interface ProjectSuggestion {
  title: string;
  description: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  impact: 'High' | 'Medium' | 'Low';
}

interface ProjectSuggestionsProps {
  targetRole: string;
  experienceLevel: string;
  missingSkills: string[];
}

const ProjectSuggestions: React.FC<ProjectSuggestionsProps> = ({ 
  targetRole, 
  experienceLevel, 
  missingSkills 
}) => {
  const projectSuggestions: Record<string, ProjectSuggestion[]> = {
    'Frontend Developer': [
      {
        title: 'Interactive Dashboard',
        description: 'Build a responsive analytics dashboard with charts and real-time data',
        skills: ['React', 'TypeScript', 'Chart.js', 'CSS Grid'],
        difficulty: 'Intermediate',
        estimatedTime: '2-3 weeks',
        impact: 'High'
      },
      {
        title: 'E-commerce Store',
        description: 'Create a full-featured online store with cart, payments, and admin panel',
        skills: ['React', 'Redux', 'Stripe API', 'Responsive Design'],
        difficulty: 'Advanced',
        estimatedTime: '4-6 weeks',
        impact: 'High'
      }
    ],
    'Full-Stack Developer': [
      {
        title: 'Social Media Platform',
        description: 'Build a Twitter-like platform with posts, likes, comments, and real-time updates',
        skills: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'JWT'],
        difficulty: 'Advanced',
        estimatedTime: '6-8 weeks',
        impact: 'High'
      },
      {
        title: 'Task Management App',
        description: 'Create a Trello-like project management tool with drag-and-drop functionality',
        skills: ['React', 'Express', 'PostgreSQL', 'Drag & Drop API'],
        difficulty: 'Intermediate',
        estimatedTime: '3-4 weeks',
        impact: 'High'
      }
    ],
    'Backend Developer': [
      {
        title: 'RESTful API with Microservices',
        description: 'Design a scalable API architecture with multiple services and proper documentation',
        skills: ['Node.js', 'Docker', 'MongoDB', 'Redis', 'Swagger'],
        difficulty: 'Advanced',
        estimatedTime: '4-5 weeks',
        impact: 'High'
      }
    ]
  };

  const suggestions = projectSuggestions[targetRole] || projectSuggestions['Full-Stack Developer'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced': return 'bg-red-500';
      case 'Intermediate': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-6">Recommended Projects</h3>
      <p className="text-gray-300 mb-6">
        Build these projects to strengthen your portfolio for {targetRole} roles
      </p>
      
      <div className="space-y-4">
        {suggestions.map((project, index) => (
          <div key={index} className="bg-black/20 rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <GitHubIcon className="w-6 h-6 text-purple-400" />
                <h4 className="text-lg font-semibold text-white">{project.title}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
                <span className={`text-sm font-medium ${getImpactColor(project.impact)}`}>
                  {project.impact} Impact
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{project.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex} 
                    className={`px-2 py-1 rounded-full text-xs ${
                      missingSkills.includes(skill) 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                ⏱️ {project.estimatedTime}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSuggestions;
