import type { PortfolioAnalysis, UserInput } from '../types';

interface StoredAnalysis {
  analysis: PortfolioAnalysis;
  userInput: UserInput;
  timestamp: number;
  username: string;
}

class AnalysisStorage {
  private storageKey = 'portfolio_analysis';

  saveAnalysis(analysis: PortfolioAnalysis, userInput: UserInput): void {
    try {
      const storedAnalysis: StoredAnalysis = {
        analysis,
        userInput,
        timestamp: Date.now(),
        username: userInput.username
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(storedAnalysis));
      console.log('Analysis saved to localStorage');
    } catch (error) {
      console.error('Failed to save analysis:', error);
    }
  }

  getLatestAnalysis(): StoredAnalysis | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return null;
      
      const analysis = JSON.parse(stored);
      console.log('Analysis loaded from localStorage');
      return analysis;
    } catch (error) {
      console.error('Failed to load analysis:', error);
      return null;
    }
  }

  hasStoredAnalysis(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  clearAnalysis(): void {
    localStorage.removeItem(this.storageKey);
    console.log('Analysis cleared from localStorage');
  }

  getAnalysisAge(): string | null {
    const stored = this.getLatestAnalysis();
    if (!stored) return null;

    const ageMs = Date.now() - stored.timestamp;
    const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
    const ageDays = Math.floor(ageHours / 24);

    if (ageDays > 0) return `${ageDays} day${ageDays > 1 ? 's' : ''} ago`;
    if (ageHours > 0) return `${ageHours} hour${ageHours > 1 ? 's' : ''} ago`;
    return 'Less than an hour ago';
  }
}

export const analysisStorage = new AnalysisStorage();
