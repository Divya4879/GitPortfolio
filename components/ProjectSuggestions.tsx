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
      },
      {
        title: 'Weather App with Maps',
        description: 'Weather forecast app with interactive maps and location-based alerts',
        skills: ['React', 'APIs', 'Geolocation', 'PWA'],
        difficulty: 'Beginner',
        estimatedTime: '1-2 weeks',
        impact: 'Medium'
      },
      {
        title: 'Portfolio Website',
        description: 'Personal portfolio with animations, dark mode, and contact form',
        skills: ['React', 'Framer Motion', 'CSS Animations', 'EmailJS'],
        difficulty: 'Intermediate',
        estimatedTime: '2-3 weeks',
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
      },
      {
        title: 'Chat Application',
        description: 'Real-time messaging app with rooms, file sharing, and user authentication',
        skills: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Cloudinary'],
        difficulty: 'Intermediate',
        estimatedTime: '3-4 weeks',
        impact: 'High'
      },
      {
        title: 'Blog Platform',
        description: 'Medium-like blogging platform with rich text editor and user profiles',
        skills: ['React', 'Node.js', 'MongoDB', 'Rich Text Editor', 'Image Upload'],
        difficulty: 'Intermediate',
        estimatedTime: '4-5 weeks',
        impact: 'High'
      },
      {
        title: 'Video Streaming App',
        description: 'Netflix-like platform with video upload, streaming, and user subscriptions',
        skills: ['React', 'Node.js', 'AWS S3', 'Video Processing', 'Payment Integration'],
        difficulty: 'Advanced',
        estimatedTime: '8-10 weeks',
        impact: 'High'
      },
      {
        title: 'Food Delivery App',
        description: 'Complete food ordering system with restaurant management and delivery tracking',
        skills: ['React', 'Node.js', 'MongoDB', 'Maps API', 'Payment Gateway'],
        difficulty: 'Advanced',
        estimatedTime: '6-8 weeks',
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
      },
      {
        title: 'Authentication Service',
        description: 'OAuth2 authentication service with JWT, refresh tokens, and role-based access',
        skills: ['Node.js', 'JWT', 'OAuth2', 'Redis', 'Rate Limiting'],
        difficulty: 'Intermediate',
        estimatedTime: '2-3 weeks',
        impact: 'High'
      },
      {
        title: 'File Storage API',
        description: 'Cloud storage service with file upload, compression, and CDN integration',
        skills: ['Node.js', 'AWS S3', 'Image Processing', 'CDN', 'Caching'],
        difficulty: 'Intermediate',
        estimatedTime: '3-4 weeks',
        impact: 'Medium'
      },
      {
        title: 'Payment Processing System',
        description: 'Secure payment gateway with webhook handling and transaction management',
        skills: ['Node.js', 'Stripe API', 'Webhooks', 'Database Transactions', 'Security'],
        difficulty: 'Advanced',
        estimatedTime: '4-5 weeks',
        impact: 'High'
      }
    ],
    'Data Scientist': [
      {
        title: 'Stock Price Predictor',
        description: 'ML model to predict stock prices with data visualization dashboard',
        skills: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'APIs'],
        difficulty: 'Intermediate',
        estimatedTime: '3-4 weeks',
        impact: 'High'
      },
      {
        title: 'Customer Churn Analysis',
        description: 'Analyze customer behavior and predict churn using machine learning',
        skills: ['Python', 'Pandas', 'Scikit-learn', 'Seaborn', 'Feature Engineering'],
        difficulty: 'Intermediate',
        estimatedTime: '2-3 weeks',
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
