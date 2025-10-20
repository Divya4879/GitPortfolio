import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import FormPage from './components/FormPage';
import LoadingScreen from './components/LoadingScreen';
import ResultsDashboard from './components/ResultsDashboard';
import SingleRepoAnalysisView from './components/SingleRepoAnalysisView';
import { analyzePortfolio, analyzeSingleRepo } from './services/geminiService';
import { getUserPublicRepos, getRepoReadmeContent, getRepoFileTree } from './services/githubService';
import type { PortfolioAnalysis, UserInput, GithubRepo, SingleRepoAnalysis } from './types';

type View = 'landing' | 'form' | 'loading' | 'results';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [analysisResult, setAnalysisResult] = useState<PortfolioAnalysis | null>(null);
  const [allPublicRepos, setAllPublicRepos] = useState<GithubRepo[]>([]);
  const [currentUser, setCurrentUser] = useState<UserInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [isDeepDiveLoading, setIsDeepDiveLoading] = useState<boolean>(false);
  const [singleRepoResult, setSingleRepoResult] = useState<SingleRepoAnalysis | null>(null);

  useEffect(() => {
    if (isAuthenticated && view === 'landing') {
      setView('form');
    }
  }, [isAuthenticated, view]);

  const handleGetStarted = () => {
    setView('form');
  };

  const handleAnalyze = useCallback(async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    setView('loading');
    setCurrentUser(userInput);

    try {
      const repos = await getUserPublicRepos(userInput.username);
      setAllPublicRepos(repos);
      
      const analysis = await analyzePortfolio(userInput, repos);
      setAnalysisResult(analysis);
      setView('results');
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setView('form');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeepDive = useCallback(async (repo: GithubRepo) => {
    if (!currentUser) return;
    
    setSelectedRepo(repo);
    setIsDeepDiveLoading(true);
    setSingleRepoResult(null);

    try {
      const [readmeContent, fileTree] = await Promise.all([
        getRepoReadmeContent(currentUser.username, repo.name),
        getRepoFileTree(currentUser.username, repo.name)
      ]);

      const analysis = await analyzeSingleRepo(repo, readmeContent, fileTree, currentUser);
      setSingleRepoResult(analysis);
    } catch (err) {
      console.error("Deep dive analysis failed:", err);
    } finally {
      setIsDeepDiveLoading(false);
    }
  }, [currentUser]);

  const handleCloseDeepDive = () => {
    setSelectedRepo(null);
    setSingleRepoResult(null);
  };
  
  const handleReset = useCallback(() => {
    setView('landing');
    setAnalysisResult(null);
    setError(null);
    setCurrentUser(null);
    setAllPublicRepos([]);
  }, []);

  const renderContent = () => {
    if (authLoading) {
      return <LoadingScreen />;
    }

    switch (view) {
      case 'form':
        return <FormPage onAnalyze={handleAnalyze} isLoading={isLoading} error={error} />;
      case 'loading':
        return <LoadingScreen />;
      case 'results':
        return analysisResult && currentUser && (
            <ResultsDashboard 
                analysis={analysisResult} 
                userInput={currentUser} 
                allRepos={allPublicRepos}
                onReset={handleReset}
                onSelectRepo={handleDeepDive}
            />
        );
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-100 selection:bg-purple-500 selection:text-white">
        <main className="w-full">
            {renderContent()}
        </main>
        {selectedRepo && (
          <SingleRepoAnalysisView 
            repoName={selectedRepo.name}
            isLoading={isDeepDiveLoading}
            analysis={singleRepoResult}
            onClose={handleCloseDeepDive}
          />
        )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
