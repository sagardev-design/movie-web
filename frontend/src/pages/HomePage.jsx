import { useEffect, useState } from 'react';
import { ArrowDownUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import MovieGrid from '../components/movies/MovieGrid';
import Loader from '../components/common/Loader';
import { fetchMovies } from '../store/slices/movieSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const { movies, pagination, isLoading, error } = useSelector((state) => state.movies);
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const debounceId = setTimeout(() => {
      dispatch(
        fetchMovies({
          search: query.trim() || undefined,
          sortBy: 'year',
          sortOrder,
          page,
        }),
      );
    }, 450);

    return () => clearTimeout(debounceId);
  }, [dispatch, query, sortOrder, page]);

  useEffect(() => {
    setPage(1);
  }, [query, sortOrder]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">Browse movies</h1>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies by title"
              className="w-full rounded-md border border-white/10 bg-[#181b1f] py-3 pl-10 pr-4 text-sm outline-none ring-amber-400/40 placeholder:text-stone-500 focus:ring-2"
            />
          </label>
          <label className="relative">
            <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full appearance-none rounded-md border border-white/10 bg-[#181b1f] py-3 pl-10 pr-4 text-sm outline-none ring-amber-400/40 focus:ring-2"
            >
              <option value="desc">Year: Newest first</option>
              <option value="asc">Year: Oldest first</option>
            </select>
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-300">
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>
      </section>

      {isLoading && <Loader />}
      {error && <p className="rounded-md border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}
      {!isLoading && !error && (
        <>
          <MovieGrid movies={movies} />
          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-sm text-stone-400">
              Page {pagination.page || page} of {pagination.pages || 1}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-stone-200 transition hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => setPage((currentPage) => Math.min(currentPage + 1, pagination.pages || currentPage + 1))}
                disabled={page >= (pagination.pages || 1)}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-stone-200 transition hover:border-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
