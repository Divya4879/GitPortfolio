import type { GithubRepo } from '../types';
import { githubAuth } from './githubAuth';

const GITHUB_API_BASE = 'https://api.github.com';

// Get authenticated headers
const getAuthHeaders = () => {
    const token = githubAuth.getToken();
    return {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PortfolioPilot/1.0',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Fetch all public repositories for a given user
export const getUserPublicRepos = async (username: string): Promise<GithubRepo[]> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?type=owner&sort=updated&per_page=100`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`GitHub user "${username}" not found.`);
            }
            if (response.status === 403) {
                throw new Error('GitHub API rate limit exceeded. Please try again later.');
            }
            throw new Error('Failed to fetch repositories from GitHub.');
        }
        
        const data = await response.json();
        
        // Return basic repo info without making additional API calls to avoid rate limits
        return data.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            owner: { login: repo.owner.login },
            size: repo.size,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            topics: repo.topics || []
        }));
    } catch (error) {
        console.error('GitHub API error (getUserPublicRepos):', error);
        throw error;
    }
};

// Fetch the content of a repository's README file
export const getRepoReadmeContent = async (username: string, repo: string): Promise<string> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repo}/readme`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) return "No README file found.";
        const data = await response.json();
        return atob(data.content); // Decode base64 content
    } catch (error) {
        console.error('GitHub API error (getRepoReadmeContent):', error);
        return "Error fetching README.";
    }
};

// Fetch the file and directory structure of a repository
export const getRepoFileTree = async (username: string, repo: string): Promise<string> => {
     try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repo}/git/trees/main?recursive=1`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) return "Could not fetch file tree. The repository might be empty or have a different default branch.";
        const data = await response.json();
        if (data.truncated) {
            return "File tree is too large to display.";
        }
        return data.tree.map((file: any) => file.path).join('\n');
    } catch (error) {
        console.error('GitHub API error (getRepoFileTree):', error);
        return "Error fetching file tree.";
    }
};
