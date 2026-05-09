import { useEffect, useState } from 'react';
import { ArrowDownUp, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import MovieGrid from '../components/movies/MovieGrid';
import Loader from '../components/common/Loader';
import { addFavoriteMovie, fetchFavorites, fetchMovies, removeFavoriteMovie } from '../store/slices/movieSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const { favoriteActionLoadingId, favorites, movies, pagination, isLoading, error } = useSelector((state) => state.movies);
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
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
    dispatch(fetchFavorites());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [query, sortOrder]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSearchOpen(false);
    setPage(1);
  };

  const handleSearchToggle = () => {
    if (isSearchOpen && query) {
      setQuery('');
      setPage(1);
    }

    setIsSearchOpen((currentValue) => !currentValue);
  };

  const handleSortChange = (nextSortOrder) => {
    setSortOrder(nextSortOrder);
    setIsSortOpen(false);
  };

  const handleFavoriteToggle = (movie) => {
    const movieId = movie.tmdbId || movie.id;
    const isFavorite = favorites.some((favorite) => isSameMovie(favorite, movie));

    if (isFavorite) {
      dispatch(removeFavoriteMovie(movieId));
      return;
    }

    dispatch(addFavoriteMovie(movieId));
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-normal sm:text-4xl">Browse movies</h1>
          <div className="flex items-center gap-2">
            <form
              onSubmit={handleSubmit}
              className={`flex items-center overflow-hidden rounded-md border border-white/10 bg-[#181b1f] transition-all ${
                isSearchOpen ? 'w-[min(72vw,320px)]' : 'w-11'
              }`}
            >
              <button
                type="button"
                onClick={handleSearchToggle}
                aria-label={isSearchOpen && query ? 'Clear search' : 'Search movies'}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-stone-300 transition hover:text-amber-300"
              >
                {isSearchOpen && query ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </button>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search movies"
                className="h-11 min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none placeholder:text-stone-500"
              />
            </form>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen((currentValue) => !currentValue)}
                aria-label="Sort movies"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-[#181b1f] text-stone-300 transition hover:border-amber-400 hover:text-amber-300"
              >
                <ArrowDownUp className="h-4 w-4" />
              </button>
              {isSortOpen && (
                <div className="absolute right-0 z-10 mt-2 w-32 overflow-hidden rounded-md border border-white/10 bg-[#181b1f] shadow-xl">
                  <button
                    type="button"
                    onClick={() => handleSortChange('desc')}
                    className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-white/5 ${
                      sortOrder === 'desc' ? 'text-amber-300' : 'text-stone-200'
                    }`}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortChange('asc')}
                    className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-white/5 ${
                      sortOrder === 'asc' ? 'text-amber-300' : 'text-stone-200'
                    }`}
                  >
                    Old
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {query && <p className="text-sm text-stone-400">Searching for "{query}"</p>}
      </section>

      {isLoading && <Loader />}
      {error && <p className="rounded-md border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</p>}
      {!isLoading && !error && (
        <>
          <MovieGrid
            favoriteActionLoadingId={favoriteActionLoadingId}
            favorites={favorites}
            movies={movies}
            onFavoriteToggle={handleFavoriteToggle}
          />
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

function isSameMovie(firstMovie, secondMovie) {
  return (
    firstMovie.id === secondMovie.id ||
    firstMovie.tmdbId === secondMovie.tmdbId ||
    firstMovie.id === secondMovie.tmdbId ||
    firstMovie.tmdbId === secondMovie.id
  );
}
