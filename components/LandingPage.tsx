import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GitHubIcon, ArrowRightIcon, CheckCircleIcon } from './icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { isAuthenticated, user, error, login, logout, clearError } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      onGetStarted();
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Header Image */}
      <div 
        className="h-[50vh] w-full bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/header-image.png)' }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* User Info & Logout */}
        {isAuthenticated && user && (
          <div className="absolute top-4 right-4 flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <img 
              src={user.avatar_url} 
              alt={user.name} 
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white text-sm">{user.name || user.login}</span>
            <button
              onClick={logout}
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="relative -mt-20 z-10">
        <div className="max-w-5xl mx-auto px-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-red-200 font-medium">Authentication Error</h4>
                  <p className="text-red-300 text-sm mt-1">{error.message}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-300 hover:text-red-100 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 mb-16 border border-white/10 shadow-2xl">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-light text-white mb-6 leading-tight tracking-wide">
                Transform your GitHub profile into a 
                <span className="font-medium text-purple-300"> career-accelerating portfolio</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Leverage AI-powered insights to optimize your repositories and land your dream job
              </p>
              <button
                onClick={handleGetStarted}
                disabled={!!error}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-4 px-10 rounded-full text-lg transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthenticated ? 'Continue to Analysis' : 'Get Started with GitHub'}
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-light text-center text-white mb-12 tracking-wide">
              Why Choose PortfolioPilot
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <GitHubIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">AI Analysis</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Advanced algorithms evaluate your code quality and project structure</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">Smart Recommendations</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Receive targeted suggestions to enhance your portfolio impact</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRightIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">Portfolio Optimization</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Showcase your skills effectively to attract top employers</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <GitHubIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-3">Deep Insights</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Comprehensive analysis of documentation and code architecture</p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="pb-16">
            <h2 className="text-2xl font-light text-center text-white mb-12 tracking-wide">
              How It Works
            </h2>
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="flex items-start space-x-6 group">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Connect Your GitHub</h3>
                  <p className="text-gray-400 leading-relaxed">Securely authenticate with your GitHub account to access your repositories and profile data</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">AI-Powered Analysis</h3>
                  <p className="text-gray-400 leading-relaxed">Our advanced AI examines your code quality, documentation, commit patterns, and overall portfolio structure</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6 group">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Receive Actionable Insights</h3>
                  <p className="text-gray-400 leading-relaxed">Get personalized recommendations to transform your GitHub into a career-boosting portfolio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
