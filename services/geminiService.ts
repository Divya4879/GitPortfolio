
import { GoogleGenAI, Type } from "@google/genai";
import type { PortfolioAnalysis, UserInput, GithubRepo, SingleRepoAnalysis } from '../types';

const apiKey = "AIzaSyDVOHpq6WFn7YxQeyhFLjYwxLX14AO88-c";

const ai = new GoogleGenAI({ apiKey });

// Schema for the main portfolio analysis
const portfolioAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.INTEGER, description: "A single overall score from 0 to 100 for the entire portfolio." },
        summary: { type: Type.STRING, description: "A two-paragraph summary of the portfolio's strengths and key areas for improvement, based on the provided repository list." },
        scoreBreakdown: {
            type: Type.OBJECT,
            properties: {
                documentation: { type: Type.INTEGER },
                codeQuality: { type: Type.INTEGER },
                projectDiversity: { type: Type.INTEGER },
                commitPatterns: { type: Type.INTEGER },
                techStack: { type: Type.INTEGER },
            },
            required: ['documentation', 'codeQuality', 'projectDiversity', 'commitPatterns', 'techStack']
        },
        repositories: {
            type: Type.ARRAY,
            description: "An analysis of the user's top 3-5 most impressive or relevant public repositories from the provided list.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['name', 'description', 'score', 'strengths', 'areasForImprovement', 'technologies']
            }
        },
        recommendations: {
            type: Type.ARRAY,
            description: "A list of 5-7 actionable recommendations, prioritized.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique kebab-case ID." },
                    priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['Documentation', 'Code Quality', 'Project Diversity', 'Tech Stack', 'Professionalism'] }
                },
                required: ['id', 'priority', 'title', 'description', 'category']
            }
        },
        commitAnalysis: {
            type: Type.OBJECT,
            properties: {
                consistency: { type: Type.STRING },
                messageQuality: { type: Type.STRING },
                frequency: { type: Type.STRING },
                summary: { type: Type.STRING }
            },
            required: ['consistency', 'messageQuality', 'frequency', 'summary']
        },
        techStackAnalysis: {
            type: Type.OBJECT,
            properties: {
                languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                summary: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['languages', 'frameworks', 'tools', 'summary', 'recommendations']
        }
    },
    required: ['overallScore', 'summary', 'scoreBreakdown', 'repositories', 'recommendations', 'commitAnalysis', 'techStackAnalysis']
};

// Schema for the single repository deep-dive analysis
const singleRepoAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        repoName: { type: Type.STRING },
        overallImpression: { type: Type.STRING, description: "A concise, one-paragraph summary of the repository's quality and purpose." },
        codeStructure: {
            type: Type.OBJECT,
            properties: {
                rating: { type: Type.STRING, enum: ['Excellent', 'Good', 'Fair', 'Needs Improvement'] },
                feedback: { type: Type.STRING, description: "Detailed feedback on the file organization, naming conventions, and modularity based on the provided file tree." }
            },
            required: ['rating', 'feedback']
        },
        readmeQuality: {
            type: Type.OBJECT,
            properties: {
                rating: { type: Type.STRING, enum: ['Excellent', 'Good', 'Fair', 'Needs Improvement'] },
                feedback: { type: Type.STRING, description: "Analysis of the README's completeness, clarity, and professionalism." },
                suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 specific suggestions for improving the README." }
            },
            required: ['rating', 'feedback', 'suggestions']
        },
        potentialImprovements: {
            type: Type.ARRAY,
            description: "A list of 2-3 high-impact, actionable improvements for this specific repository.",
            items: {
                type: Type.OBJECT,
                properties: {
                    area: { type: Type.STRING, description: "e.g., 'Error Handling', 'Component Reusability', 'Add Unit Tests'" },
                    suggestion: { type: Type.STRING, description: "A detailed suggestion for the improvement." }
                },
                required: ['area', 'suggestion']
            }
        }
    },
    required: ['repoName', 'overallImpression', 'codeStructure', 'readmeQuality', 'potentialImprovements']
};


export const analyzePortfolio = async (userInput: UserInput, repos: GithubRepo[]): Promise<PortfolioAnalysis> => {
    const { username, targetRole, experienceLevel, focusAreas } = userInput;

    const repoData = repos.map(r => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count
    }));
    
    const prompt = `
      Act as an expert senior software engineer and hiring manager. Perform a detailed portfolio analysis for GitHub user "${username}".

      **User Profile:**
      - Target Role: ${targetRole}
      - Experience Level: ${experienceLevel}
      - Key Focus Areas: ${focusAreas.join(', ')}

      **User's Public Repositories (JSON format):**
      ${JSON.stringify(repoData, null, 2)}

      **Instructions:**
      1.  **Analyze the provided list of repositories.** Your entire analysis MUST be based on this real data.
      2.  Identify the 3-5 most impactful repositories and feature them in the 'repositories' section of your response. Impact can be judged by relevance to the target role, complexity, or apparent completeness.
      3.  Infer commit patterns and tech stack from the repository languages and descriptions.
      4.  Provide a professional, encouraging, and highly specific analysis. The scores should be judged against the user's experience level.
      5.  Strictly adhere to the JSON schema. Do not output any text outside the JSON structure.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: portfolioAnalysisSchema,
                temperature: 0.3,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PortfolioAnalysis;
    } catch (error) {
        console.error("Error calling Gemini API for portfolio analysis:", error);
        throw new Error("The AI model failed to generate a portfolio analysis.");
    }
};

export const analyzeSingleRepo = async (repo: GithubRepo, readmeContent: string, fileTree: string, userInput: UserInput): Promise<SingleRepoAnalysis> => {
    const prompt = `
      Act as an expert code reviewer and senior engineer. You are performing a deep-dive analysis of a single GitHub repository.

      **User Profile:**
      - Target Role: ${userInput.targetRole}
      - Experience Level: ${userInput.experienceLevel}
      
      **Repository Details:**
      - Name: ${repo.name}
      - Description: ${repo.description}
      - Primary Language: ${repo.language}

      **Repository README Content:**
      \`\`\`markdown
      ${readmeContent}
      \`\`\`

      **Repository File Tree:**
      \`\`\`
      ${fileTree}
      \`\`\`

      **Instructions:**
      1.  Based *only* on the provided README content and file tree, evaluate the repository's documentation and structure.
      2.  **README Quality:** Assess if the README is comprehensive. Does it have a clear title, description, setup instructions, usage examples, and license info? Is it well-formatted?
      3.  **Code & File Structure:** Analyze the file tree. Is it well-organized? Does it follow common conventions for its language/framework (e.g., src, dist, components, utils)? Are file names clear and consistent?
      4.  Provide specific, actionable feedback.
      5.  Strictly adhere to the JSON schema. Do not add any text outside the JSON structure.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleRepoAnalysisSchema,
                temperature: 0.2,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SingleRepoAnalysis;
    } catch (error) {
        console.error("Error calling Gemini API for single repo analysis:", error);
        throw new Error("The AI model failed to analyze the repository.");
    }
};
