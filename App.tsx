import React, { useState, useCallback, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import HeroPage from './components/HeroPage';
import LandingPage from './components/LandingPage';
import FormPage from './components/FormPage';
import LoadingScreen from './components/LoadingScreen';
import ResultsDashboard from './components/ResultsDashboard';
import SingleRepoAnalysisView from './components/SingleRepoAnalysisView';
import AuthGuard from './components/AuthGuard';
import { analyzePortfolio, analyzeSingleRepo } from './services/geminiService';
import { getUserPublicRepos, getRepoReadmeContent, getRepoFileTree } from './services/githubService';
import type { PortfolioAnalysis, UserInput, GithubRepo, SingleRepoAnalysis } from './types';
import { GitHubIcon } from './components/icons';

type View = 'hero' | 'landing' | 'form' | 'loading' | 'results';

const App: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const [view, setView] = useState<View>('hero');
  const [analysisResult, setAnalysisResult] = useState<PortfolioAnalysis | null>(null);
  const [allPublicRepos, setAllPublicRepos] = useState<GithubRepo[]>([]);
  const [currentUser, setCurrentUser] = useState<UserInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto-navigate to form when authenticated
  useEffect(() => {
    if (isAuthenticated && (view === 'hero' || view === 'landing')) {
      setView('form');
    }
  }, [isAuthenticated, view]);

  // State for the single repo deep-dive
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [isDeepDiveLoading, setIsDeepDiveLoading] = useState<boolean>(false);
  const [singleRepoResult, setSingleRepoResult] = useState<SingleRepoAnalysis | null>(null);

  const handleGetStarted = () => {
    setView('form');
  };

  const handleAnalyze = useCallback(async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    setView('loading');
    setCurrentUser(userInput);
    setAllPublicRepos([]);

    try {
      // Step 1: Fetch real repository data from GitHub
      const repos = await getUserPublicRepos(userInput.username);
      if (repos.length === 0) {
        setError("This GitHub user has no public repositories to analyze.");
        setView('landing');
        setIsLoading(false);
        return;
      }
      setAllPublicRepos(repos);

      // Step 2: Send the real repo data to the AI for high-level analysis
      const result = await analyzePortfolio(userInput, repos);
      setAnalysisResult(result);
      setView('results');
    } catch (err) {
      console.error("Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to analyze the portfolio. ${errorMessage} Please try again.`);
      setView('landing');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeepDive = useCallback(async (repo: GithubRepo) => {
    setSelectedRepo(repo);
    setIsDeepDiveLoading(true);
    setSingleRepoResult(null);

    try {
      const [readmeContent, fileTree] = await Promise.all([
        getRepoReadmeContent(repo.owner.login, repo.name),
        getRepoFileTree(repo.owner.login, repo.name)
      ]);

      const deepDiveResult = await analyzeSingleRepo(repo, readmeContent, fileTree, currentUser!);
      setSingleRepoResult(deepDiveResult);
    } catch (err) {
      console.error("Deep dive analysis failed:", err);
      // Handle error state in the modal if needed
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

export default App;