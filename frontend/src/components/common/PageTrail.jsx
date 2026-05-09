import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PageTrail({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-stone-400">
      <Link to="/" className="inline-flex items-center gap-1 transition hover:text-white">
        <Home className="h-4 w-4" />
        Browse
      </Link>
      {items.map((item) => (
        <span key={item.label} className="inline-flex min-w-0 items-center gap-2">
          <ChevronRight className="h-4 w-4 shrink-0 text-stone-600" />
          {item.to ? (
            <Link to={item.to} className="truncate transition hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="truncate text-stone-200">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
