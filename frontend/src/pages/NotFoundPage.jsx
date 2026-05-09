import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#101214] px-4 text-center text-stone-50">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <Link to="/" className="rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-stone-950">
        Back to movies
      </Link>
    </main>
  );
}
