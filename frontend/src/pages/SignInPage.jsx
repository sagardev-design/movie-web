import { SignIn, useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get('redirect_url');

    if (redirectUrl?.includes('/sign-in')) {
      navigate('/sign-in', { replace: true });
    }
  }, [location.search, navigate]);

  if (isLoaded && isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#101214] px-4">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" forceRedirectUrl="/" fallbackRedirectUrl="/" />
    </section>
  );
}
