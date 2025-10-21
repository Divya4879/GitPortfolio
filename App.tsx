import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import FormPage from './components/FormPage';
import LoadingScreen from './components/LoadingScreen';
import ResultsDashboard from './components/ResultsDashboard';
import SingleRepoAnalysisView from './components/SingleRepoAnalysisView';
import ErrorBoundary from './components/ErrorBoundary';
import { analyzePortfolio, analyzeSingleRepo } from './services/geminiService';
import { getUserPublicRepos, getRepoReadmeContent, getRepoFileTree } from './services/githubService';
import { analysisStorage } from './services/analysisStorage';
import { analytics } from './services/analytics';
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
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
  const [isDeepDiveLoading, setIsDeepDiveLoading] = useState<boolean>(false);
  const [singleRepoResult, setSingleRepoResult] = useState<SingleRepoAnalysis | null>(null);

  // Load saved analysis on app start
  useEffect(() => {
    if (isAuthenticated && !analysisResult) {
      const savedAnalysis = analysisStorage.getLatestAnalysis();
      if (savedAnalysis) {
        setAnalysisResult(savedAnalysis.analysis);
        setCurrentUser(savedAnalysis.userInput);
        setView('results');
        console.log('Loaded saved analysis for:', savedAnalysis.username);
      }
    }
  }, [isAuthenticated, analysisResult]);

  useEffect(() => {
    if (isAuthenticated && view === 'landing') {
      // Check if we have saved analysis
      if (analysisStorage.hasStoredAnalysis()) {
        const savedAnalysis = analysisStorage.getLatestAnalysis();
        if (savedAnalysis) {
          setAnalysisResult(savedAnalysis.analysis);
          setCurrentUser(savedAnalysis.userInput);
          setView('results');
          return;
        }
      }
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
    setLoadingProgress(0);

    try {
      setLoadingStep('Authenticating with GitHub...');
      setLoadingProgress(10);
      
      setLoadingStep('Fetching your repositories...');
      setLoadingProgress(25);
      const repos = await getUserPublicRepos(userInput.username);
      setAllPublicRepos(repos);
      
      setLoadingStep('Analyzing code quality and extracting skills...');
      setLoadingProgress(60);
      const analysis = await analyzePortfolio(userInput, repos);
      
      setLoadingStep('Generating recommendations...');
      setLoadingProgress(85);
      
      setLoadingStep('Finalizing your report...');
      setLoadingProgress(95);
      
      // Save analysis to localStorage
      analysisStorage.saveAnalysis(analysis, userInput);
      setAnalysisResult(analysis);
      
      // Track analysis completion
      if (user) {
        await analytics.trackAnalysis(user.login, userInput.targetRole);
      }
      
      setLoadingProgress(100);
      setTimeout(() => setView('results'), 500); // Small delay to show 100%
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setView('form');
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
      setLoadingStep('');
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
    setView('form');
    setAnalysisResult(null);
    setError(null);
    setCurrentUser(null);
    setAllPublicRepos([]);
    // Clear saved analysis
    analysisStorage.clearAnalysis();
  }, []);

  const renderContent = () => {
    if (authLoading) {
      return <LoadingScreen />;
    }

    switch (view) {
      case 'form':
        return <FormPage onAnalyze={handleAnalyze} isLoading={isLoading} error={error} />;
      case 'loading':
        return <LoadingScreen currentStep={loadingStep} progress={loadingProgress} />;
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
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
