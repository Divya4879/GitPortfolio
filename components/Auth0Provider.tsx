import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from '../auth0-config';

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
}

const Auth0ProviderWrapper: React.FC<Auth0ProviderWrapperProps> = ({ children }) => {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWrapper;
