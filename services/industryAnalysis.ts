interface IndustryBenchmark {
  metric: string;
  userScore: number;
  industryAverage: number;
  topPercentile: number;
  interpretation: string;
}

interface TechDemand {
  technology: string;
  demandScore: number;
  averageSalary: number;
  jobGrowth: string;
  companies: string[];
}

interface RoleInsights {
  role: string;
  requiredSkills: string[];
  averageSalary: number;
  jobOpenings: number;
  competitionLevel: 'Low' | 'Medium' | 'High';
  growthProjection: string;
}

class IndustryAnalysisService {
  private industryBenchmarks = {
    'Frontend Developer': {
      averageRepos: 15,
      averageStars: 25,
      averageCommitsPerMonth: 45,
      documentationScore: 72,
      codeQualityScore: 78,
      projectDiversityScore: 68
    },
    'Backend Developer': {
      averageRepos: 18,
      averageStars: 30,
      averageCommitsPerMonth: 52,
      documentationScore: 75,
      codeQualityScore: 82,
      projectDiversityScore: 65
    },
    'Full-Stack Developer': {
      averageRepos: 22,
      averageStars: 35,
      averageCommitsPerMonth: 58,
      documentationScore: 70,
      codeQualityScore: 80,
      projectDiversityScore: 75
    },
    'Data Scientist': {
      averageRepos: 12,
      averageStars: 20,
      averageCommitsPerMonth: 38,
      documentationScore: 68,
      codeQualityScore: 75,
      projectDiversityScore: 60
    },
    'ML Engineer': {
      averageRepos: 14,
      averageStars: 28,
      averageCommitsPerMonth: 42,
      documentationScore: 73,
      codeQualityScore: 85,
      projectDiversityScore: 62
    },
    'DevOps Engineer': {
      averageRepos: 16,
      averageStars: 22,
      averageCommitsPerMonth: 48,
      documentationScore: 80,
      codeQualityScore: 88,
      projectDiversityScore: 58
    }
  };

  private techDemandData: TechDemand[] = [
    {
      technology: 'React',
      demandScore: 95,
      averageSalary: 105000,
      jobGrowth: '+22%',
      companies: ['Meta', 'Netflix', 'Airbnb', 'Uber']
    },
    {
      technology: 'TypeScript',
      demandScore: 88,
      averageSalary: 110000,
      jobGrowth: '+35%',
      companies: ['Microsoft', 'Slack', 'Asana', 'Shopify']
    },
    {
      technology: 'Node.js',
      demandScore: 92,
      averageSalary: 108000,
      jobGrowth: '+28%',
      companies: ['Netflix', 'LinkedIn', 'Walmart', 'NASA']
    },
    {
      technology: 'Python',
      demandScore: 98,
      averageSalary: 115000,
      jobGrowth: '+41%',
      companies: ['Google', 'Instagram', 'Spotify', 'Dropbox']
    },
    {
      technology: 'JavaScript',
      demandScore: 96,
      averageSalary: 102000,
      jobGrowth: '+24%',
      companies: ['Google', 'Facebook', 'Amazon', 'Apple']
    },
    {
      technology: 'Docker',
      demandScore: 85,
      averageSalary: 125000,
      jobGrowth: '+30%',
      companies: ['Docker', 'Red Hat', 'IBM', 'VMware']
    },
    {
      technology: 'AWS',
      demandScore: 90,
      averageSalary: 130000,
      jobGrowth: '+33%',
      companies: ['Amazon', 'Netflix', 'Airbnb', 'Lyft']
    },
    {
      technology: 'Kubernetes',
      demandScore: 82,
      averageSalary: 135000,
      jobGrowth: '+38%',
      companies: ['Google', 'Red Hat', 'VMware', 'CNCF']
    }
  ];

  private roleInsights: Record<string, RoleInsights> = {
    'Frontend Developer': {
      role: 'Frontend Developer',
      requiredSkills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
      averageSalary: 95000,
      jobOpenings: 45000,
      competitionLevel: 'High',
      growthProjection: '+13% by 2032'
    },
    'Backend Developer': {
      role: 'Backend Developer',
      requiredSkills: ['Node.js', 'Python', 'SQL', 'APIs', 'Docker'],
      averageSalary: 110000,
      jobOpenings: 38000,
      competitionLevel: 'Medium',
      growthProjection: '+22% by 2032'
    },
    'Full-Stack Developer': {
      role: 'Full-Stack Developer',
      requiredSkills: ['React', 'Node.js', 'JavaScript', 'SQL', 'Git'],
      averageSalary: 105000,
      jobOpenings: 52000,
      competitionLevel: 'High',
      growthProjection: '+25% by 2032'
    },
    'Data Scientist': {
      role: 'Data Scientist',
      requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas'],
      averageSalary: 125000,
      jobOpenings: 28000,
      competitionLevel: 'Medium',
      growthProjection: '+35% by 2032'
    },
    'ML Engineer': {
      role: 'ML Engineer',
      requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes'],
      averageSalary: 140000,
      jobOpenings: 18000,
      competitionLevel: 'Low',
      growthProjection: '+40% by 2032'
    },
    'DevOps Engineer': {
      role: 'DevOps Engineer',
      requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Terraform'],
      averageSalary: 120000,
      jobOpenings: 32000,
      competitionLevel: 'Medium',
      growthProjection: '+32% by 2032'
    }
  };

  getBenchmarks(role: string, userMetrics: any): IndustryBenchmark[] {
    const roleBenchmarks = this.industryBenchmarks[role as keyof typeof this.industryBenchmarks];
    if (!roleBenchmarks) return [];

    return [
      {
        metric: 'Documentation Quality',
        userScore: userMetrics.documentation || userMetrics.documentationScore || 0,
        industryAverage: roleBenchmarks.documentationScore,
        topPercentile: roleBenchmarks.documentationScore + 20,
        interpretation: this.getInterpretation(userMetrics.documentation || userMetrics.documentationScore || 0, roleBenchmarks.documentationScore)
      },
      {
        metric: 'Code Quality',
        userScore: userMetrics.codeQuality || userMetrics.codeQualityScore || 0,
        industryAverage: roleBenchmarks.codeQualityScore,
        topPercentile: roleBenchmarks.codeQualityScore + 15,
        interpretation: this.getInterpretation(userMetrics.codeQuality || userMetrics.codeQualityScore || 0, roleBenchmarks.codeQualityScore)
      },
      {
        metric: 'Project Diversity',
        userScore: userMetrics.projectDiversity || userMetrics.projectDiversityScore || 0,
        industryAverage: roleBenchmarks.projectDiversityScore,
        topPercentile: roleBenchmarks.projectDiversityScore + 25,
        interpretation: this.getInterpretation(userMetrics.projectDiversity || userMetrics.projectDiversityScore || 0, roleBenchmarks.projectDiversityScore)
      }
    ];
  }

  getTechDemand(technologies: string[]): TechDemand[] {
    return technologies
      .map(tech => this.techDemandData.find(t => 
        t.technology.toLowerCase() === tech.toLowerCase()
      ))
      .filter(Boolean) as TechDemand[];
  }

  getRoleInsights(role: string): RoleInsights | null {
    return this.roleInsights[role] || null;
  }

  getMarketPosition(role: string, userScore: number): string {
    if (userScore >= 85) return 'Top 10% - Highly Competitive';
    if (userScore >= 75) return 'Top 25% - Strong Candidate';
    if (userScore >= 65) return 'Top 50% - Good Position';
    if (userScore >= 50) return 'Average - Room for Growth';
    return 'Below Average - Needs Improvement';
  }

  getSalaryInsights(role: string, experience: string): { min: number; avg: number; max: number } {
    const baseRole = this.roleInsights[role];
    if (!baseRole) return { min: 60000, avg: 80000, max: 120000 };

    const multipliers = {
      'Student / Aspiring': { min: 0.6, avg: 0.7, max: 0.8 },
      'Junior (0-2 years)': { min: 0.7, avg: 0.8, max: 0.9 },
      'Mid-level (2-5 years)': { min: 0.9, avg: 1.0, max: 1.2 },
      'Senior (5+ years)': { min: 1.2, avg: 1.4, max: 1.8 }
    };

    const mult = multipliers[experience as keyof typeof multipliers] || multipliers['Mid-level (2-5 years)'];
    
    return {
      min: Math.round(baseRole.averageSalary * mult.min),
      avg: Math.round(baseRole.averageSalary * mult.avg),
      max: Math.round(baseRole.averageSalary * mult.max)
    };
  }

  private getInterpretation(userScore: number, industryAvg: number): string {
    const diff = userScore - industryAvg;
    if (diff >= 15) return 'Excellent - Well above industry standard';
    if (diff >= 5) return 'Good - Above industry average';
    if (diff >= -5) return 'Average - Meets industry standard';
    if (diff >= -15) return 'Below Average - Needs improvement';
    return 'Poor - Significantly below industry standard';
  }
}

export const industryAnalysis = new IndustryAnalysisService();
