import { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/common/Loader';
import PageTrail from '../components/common/PageTrail';
import { fetchFavorites, removeFavoriteMovie } from '../store/slices/movieSlice';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const { favoriteActionLoadingId, favorites, favoritesError, isFavoritesLoading } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (isFavoritesLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageTrail items={[{ label: 'Favorites' }]} />
      <h1 className="text-3xl font-bold">Favorites</h1>
      {favoritesError && (
        <p className="rounded-md border border-red-400/30 bg-red-500/10 p-4 text-red-200">{favoritesError}</p>
      )}
      {!favoritesError && !favorites.length && (
        <p className="rounded-md border border-white/10 bg-[#181b1f] p-6 text-center text-stone-400">
          No favorites yet.
        </p>
      )}
      {!favoritesError && favorites.length > 0 && (
        <section className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((movie) => {
            const movieId = movie.tmdbId || movie.id;
            const isBusy = favoriteActionLoadingId === String(movieId);

            return (
              <article key={movieId} className="overflow-hidden rounded-lg border border-white/10 bg-[#181b1f]">
                <Link to={`/movies/${movieId}`}>
                  <img
                    src={movie.posterUrl || 'https://placehold.co/500x750/1f2937/f8fafc?text=Movie'}
                    alt={movie.title}
                    className="aspect-[2/3] w-full object-cover"
                  />
                </Link>
                <div className="space-y-3 p-3 sm:p-4">
                  <div>
                    <h2 className="line-clamp-2 text-sm font-semibold sm:text-base">{movie.title}</h2>
                    <p className="text-sm text-stone-400">{movie.releaseYear || 'Year unavailable'}</p>
                  </div>
                  <button
                    onClick={() => dispatch(removeFavoriteMovie(movieId))}
                    disabled={isBusy}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-stone-300 transition hover:border-rose-400 hover:text-rose-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
