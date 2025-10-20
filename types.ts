export interface UserInput {
  username: string;
  targetRole: string;
  experienceLevel: string;
  focusAreas: string[];
}

export interface ScoreBreakdown {
  documentation: number;
  codeQuality: number;
  projectDiversity: number;
  commitPatterns: number;
  techStack: number;
}

export interface RepoAnalysis {
  name: string;
  description: string;
  score: number;
  strengths: string[];
  areasForImprovement: string[];
  technologies: string[];
}

export interface Recommendation {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  category: 'Documentation' | 'Code Quality' | 'Project Diversity' | 'Tech Stack' | 'Professionalism';
}

export interface CommitAnalysis {
  consistency: string;
  messageQuality: string;
  frequency: string;
  summary: string;
}

export interface TechStackAnalysis {
  languages: string[];
  frameworks: string[];
  tools: string[];
  summary: string;
  recommendations: string[];
}

export interface PortfolioAnalysis {
  overallScore: number;
  summary: string;
  scoreBreakdown: ScoreBreakdown;
  repositories: RepoAnalysis[]; // This is now the AI's selection of top 3-5 repos
  recommendations: Recommendation[];
  commitAnalysis: CommitAnalysis;
  techStackAnalysis: TechStackAnalysis;
}

// Data structure from the GitHub API
export interface GithubRepo {
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    owner: {
        login: string;
    }
}

// Data structure for the single repo deep-dive analysis
export interface SingleRepoAnalysis {
  repoName: string;
  overallImpression: string;
  codeStructure: {
    rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
    feedback: string;
  };
  // Fix: Completed the definition for readmeQuality and added potentialImprovements
  readmeQuality: {
    rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
    feedback: string;
    suggestions: string[];
  };
  potentialImprovements: {
    area: string;
    suggestion: string;
  }[];
}
