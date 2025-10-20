import React from 'react';
import { CheckCircleIcon, ArrowRightIcon } from './icons';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  inDemand: boolean;
  projects: string[];
}

interface SkillsMappingProps {
  detectedSkills: Skill[];
  targetRole: string;
}

const SkillsMapping: React.FC<SkillsMappingProps> = ({ detectedSkills, targetRole }) => {
  const roleSkillRequirements = {
    'Frontend Developer': ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Vue.js', 'Angular'],
    'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Express', 'Django'],
    'Full-Stack Developer': ['React', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'MongoDB', 'Express'],
    'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'Jupyter'],
    'ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Docker', 'Kubernetes'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Linux', 'Git']
  };

  const requiredSkills = roleSkillRequirements[targetRole as keyof typeof roleSkillRequirements] || [];
  const detectedSkillNames = detectedSkills.map(s => s.name);
  const missingSkills = requiredSkills.filter(skill => !detectedSkillNames.includes(skill));

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-500';
      case 'Advanced': return 'bg-blue-500';
      case 'Intermediate': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-6">Skills Analysis for {targetRole}</h3>
      
      {/* Detected Skills */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-purple-200 mb-4">Your Skills</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {detectedSkills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <div>
                  <span className="text-white font-medium">{skill.name}</span>
                  {skill.inDemand && (
                    <span className="ml-2 px-2 py-1 bg-purple-600 text-xs rounded-full">High Demand</span>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs text-white ${getLevelColor(skill.level)}`}>
                {skill.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-orange-300 mb-4">Skills to Develop</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {missingSkills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-orange-900/20 rounded-lg border border-orange-500/30">
                <ArrowRightIcon className="w-4 h-4 text-orange-400" />
                <span className="text-orange-200 text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsMapping;
