import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loader from '../components/common/Loader';
import PageTrail from '../components/common/PageTrail';
import {
  addFavoriteMovie,
  fetchFavorites,
  fetchMovieById,
  removeFavoriteMovie,
} from '../store/slices/movieSlice';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedMovie, favorites, favoriteActionLoadingId, isLoading, error, favoritesError } = useSelector(
    (state) => state.movies,
  );

  useEffect(() => {
    dispatch(fetchMovieById(id));
    if (!favorites.length) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, favorites.length, id]);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-200">{error}</p>;
  if (!selectedMovie) return null;

  const movieId = selectedMovie.tmdbId || selectedMovie.id;
  const isFavorite = favorites.some((movie) => isSameMovie(movie, selectedMovie));
  const isFavoriteBusy = favoriteActionLoadingId === String(movieId);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavoriteMovie(movieId));
      return;
    }

    dispatch(addFavoriteMovie(movieId));
  };

  return (
    <>
      <PageTrail items={[{ label: selectedMovie.title }]} />
      <section className="grid gap-8 md:grid-cols-[280px_1fr]">
        <img
          src={selectedMovie.posterUrl || 'https://placehold.co/500x750/1f2937/f8fafc?text=Movie'}
          alt={selectedMovie.title}
          className="w-full rounded-lg border border-white/10 object-cover"
        />
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{selectedMovie.title}</h1>
              <p className="text-stone-400">
                {selectedMovie.releaseYear || 'Year unavailable'} | {selectedMovie.genre?.join(', ') || 'Genre unavailable'}
              </p>
            </div>
            <button
              onClick={handleFavoriteToggle}
              disabled={isFavoriteBusy}
              className={`inline-flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition ${
                isFavorite
                  ? 'border-rose-400 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25'
                  : 'border-white/10 bg-[#181b1f] text-stone-100 hover:border-rose-400 hover:text-rose-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Remove favorite' : 'Add favorite'}
            </button>
          </div>
          {favoritesError && (
            <p className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{favoritesError}</p>
          )}
          <p className="leading-7 text-stone-300">{selectedMovie.overview}</p>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-stone-500">Rating</dt>
              <dd className="text-lg font-semibold">
                {selectedMovie.rating ? Number(selectedMovie.rating).toFixed(1) : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500">Runtime</dt>
              <dd className="text-lg font-semibold">{selectedMovie.runtime || 'N/A'} min</dd>
            </div>
            <div>
              <dt className="text-sm text-stone-500">Director</dt>
              <dd className="text-lg font-semibold">{selectedMovie.director || 'N/A'}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
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
