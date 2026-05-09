import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Film, Heart, Search } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? 'text-white' : 'text-stone-400 hover:text-white'}`;

export default function Navbar() {
  return (
    <header className="border-b border-white/10 bg-[#151719]">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <Film className="h-5 w-5 text-amber-400" />
          CineScope
        </Link>
        <div className="flex items-center gap-5">
          <NavLink to="/" className={navLinkClass}>
            <span className="flex items-center gap-1.5">
              <Search className="h-4 w-4" />
              Browse
            </span>
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              Favorites
            </span>
          </NavLink>
          <SignedOut>
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-stone-400 transition hover:text-white">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-300">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
