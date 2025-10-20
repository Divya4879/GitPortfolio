import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserInput } from '../types';
import { TARGET_ROLES, EXPERIENCE_LEVELS, FOCUS_AREAS } from '../constants';
import { ArrowRightIcon } from './icons';

interface FormPageProps {
  onAnalyze: (userInput: UserInput) => void;
  isLoading: boolean;
  error: string | null;
}

const FormPage: React.FC<FormPageProps> = ({ onAnalyze, isLoading, error }) => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[2]);
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[1]);
  const [focusAreas, setFocusAreas] = useState<string[]>(['codeQuality', 'projectDiversity']);

  useEffect(() => {
    if (user) {
      setUsername(user.login || '');
    }
  }, [user]);

  const handleFocusAreaChange = (areaId: string) => {
    setFocusAreas(prev => 
      prev.includes(areaId) ? prev.filter(a => a !== areaId) : [...prev, areaId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onAnalyze({ username: username.trim(), targetRole, experienceLevel, focusAreas });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-100 mb-4">Let's Analyze Your Portfolio</h2>
          <p className="text-purple-300">Tell us about your goals to get personalized insights</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-200 font-medium mb-2">GitHub Username</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full px-4 py-3 bg-purple-900/50 border border-purple-500/30 rounded-lg text-purple-100 cursor-not-allowed opacity-75"
              placeholder="GitHub username will be auto-filled"
            />
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-2">Target Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-100 focus:outline-none focus:border-purple-400"
            >
              {TARGET_ROLES.map(role => (
                <option key={role} value={role} className="bg-purple-900">{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-2">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-100 focus:outline-none focus:border-purple-400"
            >
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level} value={level} className="bg-purple-900">{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-3">Focus Areas</label>
            <div className="grid grid-cols-2 gap-3">
              {FOCUS_AREAS.map(area => (
                <label key={area.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={focusAreas.includes(area.id)}
                    onChange={() => handleFocusAreaChange(area.id)}
                    className="w-5 h-5 text-purple-500 bg-purple-900/30 border-purple-500/30 rounded focus:ring-purple-400"
                  />
                  <span className="text-purple-200">{area.name}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Analyze Portfolio</span>
                <ArrowRightIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
