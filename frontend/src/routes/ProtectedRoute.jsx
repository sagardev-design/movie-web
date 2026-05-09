import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { setAuthTokenGetter } from '../services/api';

export default function ProtectedRoute({ children }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const prepareToken = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken({ skipCache: true });

        if (!token) {
          throw new Error('Clerk did not return a session token.');
        }

        setAuthTokenGetter(getToken);
        if (isMounted) {
          setTokenError(null);
          setIsTokenReady(true);
        }
      } catch (error) {
        if (isMounted) {
          setTokenError(error.message || 'Unable to prepare Clerk session token.');
          setIsTokenReady(false);
        }
      }
    };

    prepareToken();

    return () => {
      isMounted = false;
    };
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setIsTokenReady(false);
      setTokenError(null);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return <Loader />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (tokenError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101214] px-4 text-stone-50">
        <div className="max-w-md rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
          {tokenError}
        </div>
      </main>
    );
  }

  if (!isTokenReady) {
    return <Loader />;
  }

  return children;
}
