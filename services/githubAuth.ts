interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
  id: number;
}

interface AuthError {
  type: 'network' | 'auth' | 'token' | 'user';
  message: string;
}

class GitHubAuth {
  private clientId = 'Ov23liNmxxQFolb54Lpl';
  private redirectUri = window.location.origin;
  private tokenKey = 'github_token';
  private userKey = 'github_user';
  private errorKey = 'github_auth_error';

  login() {
    // Clear any previous errors
    localStorage.removeItem(this.errorKey);
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'read:user user:email public_repo',
      state: this.generateState()
    });
    
    // Store state for verification
    sessionStorage.setItem('github_oauth_state', params.get('state')!);
    
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }

  async handleCallback(): Promise<{ user: GitHubUser | null; error: AuthError | null }> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      const authError: AuthError = {
        type: 'auth',
        message: errorDescription || `GitHub OAuth error: ${error}`
      };
      this.storeError(authError);
      return { user: null, error: authError };
    }

    // Verify state parameter
    const storedState = sessionStorage.getItem('github_oauth_state');
    if (!state || state !== storedState) {
      const authError: AuthError = {
        type: 'auth',
        message: 'Invalid OAuth state parameter. Possible CSRF attack.'
      };
      this.storeError(authError);
      return { user: null, error: authError };
    }

    if (!code) {
      return { user: null, error: null };
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch('/.netlify/functions/github-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error);
      }

      const accessToken = tokenData.access_token;
      if (!accessToken) {
        throw new Error('No access token received from GitHub');
      }

      // Get user info
      const userResponse = await fetch('https://api.github.com/user', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user info: ${userResponse.status}`);
      }

      const user = await userResponse.json();
      
      // Store token and user with expiration
      const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      const authData = {
        token: accessToken,
        user: user,
        expiresAt: expirationTime
      };
      
      localStorage.setItem(this.tokenKey, JSON.stringify(authData));
      sessionStorage.removeItem('github_oauth_state');
      
      console.log('GitHub auth successful, token stored');
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return { user, error: null };
    } catch (error) {
      console.error('GitHub auth error:', error);
      const authError: AuthError = {
        type: 'token',
        message: error instanceof Error ? error.message : 'Authentication failed'
      };
      this.storeError(authError);
      return { user: null, error: authError };
    }
  }

  getUser(): GitHubUser | null {
    try {
      const authDataStr = localStorage.getItem(this.tokenKey);
      if (!authDataStr) return null;

      const authData = JSON.parse(authDataStr);
      
      // Check if token is expired
      if (Date.now() > authData.expiresAt) {
        this.logout();
        return null;
      }

      return authData.user;
    } catch (error) {
      console.error('Error getting user:', error);
      this.logout();
      return null;
    }
  }

  getToken(): string | null {
    try {
      const authDataStr = localStorage.getItem(this.tokenKey);
      if (!authDataStr) {
        console.log('No auth data found in localStorage');
        return null;
      }

      const authData = JSON.parse(authDataStr);
      
      // Check if token is expired
      if (Date.now() > authData.expiresAt) {
        console.log('Token expired, logging out');
        this.logout();
        return null;
      }

      console.log('Token found and valid');
      return authData.token;
    } catch (error) {
      console.error('Error getting token:', error);
      this.logout();
      return null;
    }
  }

  getError(): AuthError | null {
    try {
      const errorStr = localStorage.getItem(this.errorKey);
      return errorStr ? JSON.parse(errorStr) : null;
    } catch (error) {
      return null;
    }
  }

  clearError(): void {
    localStorage.removeItem(this.errorKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.errorKey);
    sessionStorage.removeItem('github_oauth_state');
    
    // Optionally redirect to home
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private storeError(error: AuthError): void {
    localStorage.setItem(this.errorKey, JSON.stringify(error));
  }

  // Check token validity by making a test API call
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }
}

export const githubAuth = new GitHubAuth();
