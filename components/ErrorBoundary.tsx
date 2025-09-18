'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Solo logear errores que no sean de refresh token
    if (!error.message?.includes('Invalid Refresh Token') && 
        !error.message?.includes('Refresh Token Not Found')) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Si es un error de refresh token, no mostrar el fallback
      if (this.state.error?.message?.includes('Invalid Refresh Token') || 
          this.state.error?.message?.includes('Refresh Token Not Found')) {
        // Limpiar localStorage y recargar la página
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
        }
        return null;
      }

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Algo salió mal</h2>
            <button
              onClick={this.resetError}
              className="bg-[#ec4d58] text-white px-4 py-2 rounded-lg"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
