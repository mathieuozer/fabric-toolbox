import { useEffect, useState } from 'react';
import { LandingPage } from './components/pages/LandingPage';
import App from './App';
import { useAuth } from './hooks/useAuth';
import { useSubscription } from './hooks/useSubscription';
import { syncSubscriptionWithBackend } from './services/subscriptionService';

export function AppRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [showDashboard, setShowDashboard] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check URL for dashboard route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/dashboard' || path.startsWith('/dashboard/')) {
      setShowDashboard(true);
    }

    // Handle subscription success redirect
    if (path === '/subscription/success') {
      setShowDashboard(true);
    }
  }, []);

  // Sync subscription with backend when user logs in
  useEffect(() => {
    async function syncSubscription() {
      if (user?.email && isAuthenticated) {
        setIsSyncing(true);
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

  // Show dashboard if authenticated or explicitly navigated there
  if (isAuthenticated || showDashboard) {
    return <App />;
  }

  // Show landing page for unauthenticated users
  return <LandingPage />;
}
