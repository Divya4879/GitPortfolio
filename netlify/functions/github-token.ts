import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'method_not_allowed',
        error_description: 'Only POST method is allowed' 
      })
    };
  }

  try {
    const { code } = JSON.parse(event.body || '{}');
    
    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'invalid_request',
          error_description: 'Authorization code is required' 
        })
      };
    }

    if (!process.env.GITHUB_CLIENT_SECRET) {
      console.error('GITHUB_CLIENT_SECRET environment variable is not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'server_error',
          error_description: 'Server configuration error' 
        })
      };
    }

    // Exchange code for access token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'PortfolioPilot/1.0'
      },
      body: JSON.stringify({
        client_id: 'Ov23liNmxxQFolb54Lpl',
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      })
    });

    if (!response.ok) {
      console.error('GitHub token exchange failed:', response.status, response.statusText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'token_exchange_failed',
          error_description: `GitHub API returned ${response.status}` 
        })
      };
    }

    const data = await response.json();

    // Check if GitHub returned an error
    if (data.error) {
      console.error('GitHub OAuth error:', data);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: data.error,
          error_description: data.error_description || 'GitHub OAuth error'
        })
      };
    }

    // Validate that we received an access token
    if (!data.access_token) {
      console.error('No access token in GitHub response:', data);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'invalid_response',
          error_description: 'No access token received from GitHub'
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        access_token: data.access_token,
        token_type: data.token_type || 'bearer',
        scope: data.scope
      })
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'internal_error',
        error_description: 'Internal server error during token exchange' 
      })
    };
  }
};
