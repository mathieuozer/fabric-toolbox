import { useEffect, useState } from 'react';
import { LandingPage } from './components/pages/LandingPage';
import App from './App';
import { useAuth } from './hooks/useAuth';
import { useSubscription } from './hooks/useSubscription';
import { syncSubscriptionWithBackend, clearSubscription } from './services/subscriptionService';

export function AppRouter() {
  const { isAuthenticated, isLoading, user, isInitialized, login, initialize, config } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [isSyncing, setIsSyncing] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check if user needs to login (navigated to /dashboard without auth)
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/dashboard' || path.startsWith('/dashboard/') || path === '/subscription/success') {
      if (!isAuthenticated && !isLoading) {
        setNeedsLogin(true);
        // Clear any fake subscription data
        clearSubscription();
      }
    }
  }, [isAuthenticated, isLoading]);

  // Sync subscription with backend when user logs in
  useEffect(() => {
    async function syncSubscription() {
      if (user?.email && isAuthenticated) {
        setIsSyncing(true);
        setNeedsLogin(false);
        try {
          await syncSubscriptionWithBackend(user.email);
          refreshSubscription();
        } catch (error) {
          console.error('Failed to sync subscription:', error);
        } finally {
          setIsSyncing(false);
        }
      }
    }
    syncSubscription();
  }, [user?.email, isAuthenticated, refreshSubscription]);

  // Handle login attempt
  const handleLogin = async () => {
    setLoginError(null);
    try {
      // Check if MSAL is initialized with config
      if (!isInitialized && config) {
        await initialize(config);
      }
      if (isInitialized) {
        await login();
      } else {
        setLoginError('Authentication not configured. Please contact support.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };

  // Show loading state
  if (isLoading || isSyncing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#2B9AC8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b' }}>{isSyncing ? 'Checking subscription...' : 'Loading...'}</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show login prompt if user needs to authenticate
  if (needsLogin && !isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #2B9AC8 0%, #47B7DF 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '24px',
            fontWeight: 700,
            color: 'white',
          }}>
            FT
          </div>

          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1a1a2e',
            margin: '0 0 8px',
          }}>
            Sign in to Fabric Toolbox
          </h1>

          <p style={{
            fontSize: '15px',
            color: '#64748b',
            margin: '0 0 32px',
            lineHeight: 1.5,
          }}>
            Sign in with your Microsoft account to access the infrastructure builder.
          </p>

          {loginError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#DC2626',
              fontSize: '14px',
            }}>
              {loginError}
            </div>
          )}

          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #2B9AC8 0%, #47B7DF 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '16px',
              boxShadow: '0 4px 14px rgba(43, 154, 200, 0.4)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
              <rect width="10" height="10" fill="white"/>
              <rect x="11" width="10" height="10" fill="white"/>
              <rect y="11" width="10" height="10" fill="white"/>
              <rect x="11" y="11" width="10" height="10" fill="white"/>
            </svg>
            Sign in with Microsoft
          </button>

          <a
            href="/"
            style={{
              fontSize: '14px',
              color: '#64748b',
              textDecoration: 'none',
            }}
          >
            ← Back to home
          </a>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return <App />;
  }

  // Show landing page for unauthenticated users
  return <LandingPage />;
}
