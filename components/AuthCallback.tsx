import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForToken, fetchCustomer } from '../lib/auth';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(`Authentication failed: ${errorParam}`);
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!code || !state) {
          setError('Missing authorization code or state');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForToken(code, state);

        // Fetch customer data
        const customer = await fetchCustomer(tokens.accessToken);

        // Update auth context via window callback
        if ((window as any).__setAuth) {
          (window as any).__setAuth(tokens, customer);
        }

        // Redirect to account page
        navigate('/account');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
            <p className="text-white/60">{error}</p>
            <p className="text-white/40 mt-2">Redirecting to home...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-white mb-2">Logging you in...</h1>
            <p className="text-white/60">Please wait while we complete authentication</p>
          </>
        )}
      </div>
    </div>
  );
}
