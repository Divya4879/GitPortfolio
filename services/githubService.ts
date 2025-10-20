import type { GithubRepo } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

// Fetch all public repositories for a given user
export const getUserPublicRepos = async (username: string): Promise<GithubRepo[]> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?type=owner&sort=updated&per_page=100`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`GitHub user "${username}" not found.`);
            }
            throw new Error('Failed to fetch repositories from GitHub.');
        }
        const data = await response.json();
        
        // Get detailed info for each repository
        const reposWithDetails = await Promise.all(
            data.slice(0, 20).map(async (repo: any) => {
                try {
                    // Fetch languages for each repo
                    const langResponse = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repo.name}/languages`);
                    const languages = langResponse.ok ? await langResponse.json() : {};
                    
                    // Fetch topics and additional details
                    const repoResponse = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repo.name}`);
                    const repoDetails = repoResponse.ok ? await repoResponse.json() : repo;
                    
                    return {
                        name: repo.name,
                        description: repo.description,
                        html_url: repo.html_url,
                        language: repo.language,
                        stargazers_count: repo.stargazers_count,
                        forks_count: repo.forks_count,
                        owner: { login: repo.owner.login },
                        languages: Object.keys(languages),
                        language_stats: languages,
                        topics: repoDetails.topics || [],
                        size: repo.size,
                        created_at: repo.created_at,
                        updated_at: repo.updated_at,
                        has_readme: repoDetails.has_wiki || false
                    };
                } catch (error) {
                    // Return basic repo info if detailed fetch fails
                    return {
                        name: repo.name,
                        description: repo.description,
                        html_url: repo.html_url,
                        language: repo.language,
                        stargazers_count: repo.stargazers_count,
                        forks_count: repo.forks_count,
                        owner: { login: repo.owner.login }
                    };
                }
            })
        );
        
        return reposWithDetails;
    } catch (error) {
        console.error('GitHub API error (getUserPublicRepos):', error);
        throw error;
    }
};

// Fetch the content of a repository's README file
export const getRepoReadmeContent = async (username: string, repo: string): Promise<string> => {
    try {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repo}/readme`);
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
        const response = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repo}/git/trees/main?recursive=1`);
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
