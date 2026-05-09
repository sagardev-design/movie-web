import { SignUp, useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get('redirect_url');

    if (redirectUrl?.includes('/sign-up')) {
      navigate('/sign-up', { replace: true });
    }
  }, [location.search, navigate]);

  if (isLoaded && isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#101214] px-4">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/" fallbackRedirectUrl="/" />
    </section>
  );
}
