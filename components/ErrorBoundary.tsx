import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">⚠️</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-4">
              Oops! Something went wrong
            </h2>
            
            <p className="text-purple-300 mb-6">
              We encountered an unexpected error while analyzing your portfolio.
            </p>
            
            <div className="bg-black/20 rounded-lg p-4 mb-6 text-left">
              <p className="text-red-300 text-sm font-mono">
                {this.state.error?.message || 'Unknown error occurred'}
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
            
            <p className="text-purple-400 text-sm mt-6">
              If the problem persists, please try again later or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
