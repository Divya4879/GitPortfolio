interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

class GitHubAuth {
  private clientId = 'Ov23liNmxxQFolb54Lpl';
  private redirectUri = window.location.origin;

  login() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'read:user user:email public_repo'
    });
    
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }

  async handleCallback(): Promise<GitHubUser | null> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) return null;

    try {
      // Exchange code for access token
      const tokenResponse = await fetch('/.netlify/functions/github-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const { access_token } = await tokenResponse.json();
      
      // Get user info
      const userResponse = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      const user = await userResponse.json();
      
      // Store token and user
      localStorage.setItem('github_token', access_token);
      localStorage.setItem('github_user', JSON.stringify(user));
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return user;
    } catch (error) {
      console.error('GitHub auth error:', error);
      return null;
    }
  }

  getUser(): GitHubUser | null {
    const userStr = localStorage.getItem('github_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('github_token');
  }

  logout() {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
    window.location.reload();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const githubAuth = new GitHubAuth();
