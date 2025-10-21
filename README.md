# 🚀 GitHub Portfolio Analyzer & Optimizer

> **AI-Powered Portfolio Analysis with Industry Benchmarks and Career Insights**

Transform your GitHub profile into a competitive advantage with intelligent analysis, personalized recommendations, and real-time industry benchmarking.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-blue?style=for-the-badge)](https://your-netlify-url.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Divya4879/github-portfolio-analyzer)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

## ✨ Features

### 🎯 **Comprehensive Portfolio Analysis**
- **AI-Powered Scoring**: Advanced analysis using Google Gemini AI
- **Industry Benchmarking**: Compare against real industry standards
- **Role-Specific Insights**: Tailored analysis for Frontend, Backend, Full-Stack, DevOps, Data Science, and ML Engineering roles
- **Experience-Level Calibration**: Scoring adjusted for Junior, Mid-level, and Senior positions

### 📊 **Detailed Metrics & Insights**
- **Overall Portfolio Score** (0-100) with detailed breakdown
- **Code Quality Assessment** based on repository structure and patterns
- **Documentation Quality** analysis across all repositories
- **Project Diversity** evaluation for well-rounded portfolios
- **Commit Pattern Analysis** for consistency and professionalism
- **Technology Stack** assessment and recommendations

### 💰 **Career Intelligence**
- **Salary Insights** by role and experience level
- **Market Position** analysis (Top 10%, 25%, 50%, etc.)
- **Technology Demand** scoring with growth projections
- **Job Market Data** including openings and competition levels
- **Company Insights** showing which companies use your tech stack

### 🔍 **Deep-Dive Repository Analysis**
- **Single Repository Analysis** with detailed feedback
- **Code Structure** evaluation and suggestions
- **README Quality** assessment with improvement recommendations
- **Specific Improvement Areas** with actionable suggestions

### 🎨 **Professional Features**
- **GitHub OAuth Integration** for seamless authentication
- **PDF Export** functionality for sharing analysis results
- **Responsive Design** optimized for all devices
- **Real-time Progress** tracking during analysis
- **Data Persistence** with local storage for quick access

## 🛠️ Technology Stack

### **Frontend**
- **React 19** with TypeScript for type-safe development
- **Vite** for lightning-fast development and building
- **Tailwind CSS** for modern, responsive styling
- **HTML2Canvas & jsPDF** for PDF generation

### **AI & Analytics**
- **Google Gemini AI** for intelligent portfolio analysis
- **Structured JSON Schema** for consistent AI responses
- **Industry Benchmarking Engine** with real market data

### **APIs & Services**
- **GitHub REST API** for repository data fetching
- **GitHub OAuth** for secure authentication
- **Netlify Functions** for serverless backend operations

### **Development Tools**
- **TypeScript** for enhanced developer experience
- **ESLint & Prettier** for code quality
- **Vite Plugin React** for optimized React development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key
- GitHub OAuth App (optional, for enhanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divya4879/github-portfolio-analyzer.git
   cd github-portfolio-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GITHUB_CLIENT_ID=your_github_oauth_client_id (optional)
   VITE_GITHUB_CLIENT_SECRET=your_github_oauth_secret (optional)
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 📋 Usage Guide

### **Step 1: Authentication**
- Sign in with GitHub OAuth for enhanced features
- Or proceed with manual username entry

### **Step 2: Configure Analysis**
- **Username**: Enter the GitHub username to analyze
- **Target Role**: Select from Frontend, Backend, Full-Stack, DevOps, Data Scientist, ML Engineer
- **Experience Level**: Choose Student/Aspiring, Junior (0-2 years), Mid-level (2-5 years), or Senior (5+ years)
- **Focus Areas**: Select specific areas for detailed analysis

### **Step 3: Review Results**
- **Overall Score**: Comprehensive portfolio rating
- **Detailed Breakdown**: Scores for documentation, code quality, project diversity, etc.
- **Industry Benchmarks**: See how you compare to industry standards
- **Recommendations**: Prioritized action items for improvement
- **Career Insights**: Salary ranges, market position, and growth opportunities

### **Step 4: Deep Dive (Optional)**
- Click on any repository for detailed analysis
- Get specific feedback on code structure and documentation
- Receive targeted improvement suggestions

### **Step 5: Export & Share**
- Download your analysis as a professional PDF
- Share insights with potential employers or mentors

## 🏗️ Project Structure

```
github-portfolio-analyzer/
├── src/
│   ├── components/           # React components
│   │   ├── LandingPage.tsx   # Marketing landing page
│   │   ├── FormPage.tsx      # Analysis configuration form
│   │   ├── LoadingScreen.tsx # Progress tracking during analysis
│   │   ├── ResultsDashboard.tsx # Main results display
│   │   ├── IndustryInsights.tsx # Career and market insights
│   │   └── SingleRepoAnalysisView.tsx # Deep-dive repository analysis
│   ├── services/             # Business logic and API integrations
│   │   ├── geminiService.ts  # AI analysis engine
│   │   ├── githubService.ts  # GitHub API integration
│   │   ├── industryAnalysis.ts # Benchmarking and career insights
│   │   ├── githubAuth.ts     # OAuth authentication
│   │   └── analysisStorage.ts # Local data persistence
│   ├── contexts/             # React context providers
│   │   └── AuthContext.tsx   # Authentication state management
│   ├── types.ts              # TypeScript type definitions
│   ├── constants.ts          # Application constants
│   └── App.tsx               # Main application component
├── public/                   # Static assets
├── netlify/                  # Netlify Functions
└── dist/                     # Production build output
```

## 🔧 Configuration

### **Google Gemini AI Setup**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env` file as `VITE_GEMINI_API_KEY`

### **GitHub OAuth Setup (Optional)**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to your domain
4. Add Client ID and Secret to your `.env` file

### **Netlify Deployment**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy automatically on push to main branch

## 📊 Industry Benchmarks

The analyzer includes comprehensive benchmarks for:

### **Roles Supported**
- **Frontend Developer**: React, Vue, Angular, TypeScript focus
- **Backend Developer**: Node.js, Python, Java, API development
- **Full-Stack Developer**: End-to-end application development
- **DevOps Engineer**: Infrastructure, CI/CD, containerization
- **Data Scientist**: Python, R, machine learning, analytics
- **ML Engineer**: TensorFlow, PyTorch, model deployment

### **Metrics Tracked**
- **Documentation Quality**: README completeness, code comments
- **Code Quality**: Structure, patterns, best practices
- **Project Diversity**: Variety of technologies and project types
- **Commit Patterns**: Consistency, message quality, frequency
- **Technology Stack**: Modern tools, framework usage, industry relevance

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper TypeScript types
4. **Add tests** if applicable
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain responsive design principles
- Add proper error handling
- Update documentation for new features
- Test across different screen sizes

## 📈 Roadmap

### **Upcoming Features**
- [ ] **Multi-language Support** for global accessibility
- [ ] **Team Analysis** for organization-wide insights
- [ ] **Historical Tracking** to monitor improvement over time
- [ ] **Integration APIs** for HR platforms and job boards
- [ ] **Advanced AI Models** for even more accurate analysis
- [ ] **Custom Benchmarks** for specific companies or roles
- [ ] **Collaboration Features** for mentorship and code reviews

### **Performance Improvements**
- [ ] **Caching Layer** for faster repeat analyses
- [ ] **Progressive Loading** for large portfolios
- [ ] **Offline Support** for core functionality
- [ ] **Mobile App** for iOS and Android

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful natural language processing
- **GitHub API** for comprehensive repository data
- **React Community** for excellent development tools
- **Tailwind CSS** for beautiful, responsive styling
- **Netlify** for seamless deployment and hosting

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Divya4879/github-portfolio-analyzer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Divya4879/github-portfolio-analyzer/discussions)
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **Twitter**: [@YourTwitterHandle](https://twitter.com/YourTwitterHandle)

---

<div align="center">

**Built with ❤️ for the developer community**

[⭐ Star this repo](https://github.com/Divya4879/github-portfolio-analyzer) • [🐛 Report Bug](https://github.com/Divya4879/github-portfolio-analyzer/issues) • [💡 Request Feature](https://github.com/Divya4879/github-portfolio-analyzer/issues)

</div>
