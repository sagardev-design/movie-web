import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MovieCard({ isBusy = false, isFavorite = false, movie, onFavoriteToggle }) {
  const rating = movie.rating ? Number(movie.rating).toFixed(1) : 'N/A';

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onFavoriteToggle?.(movie);
  };

  return (
    <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#181b1f]">
      <Link to={`/movies/${movie._id || movie.id}`} className="block shrink-0">
        <img
          src={movie.posterUrl || 'https://placehold.co/500x750/1f2937/f8fafc?text=Movie'}
          alt={movie.title}
          className="aspect-[2/3] w-full object-cover"
        />
      </Link>
      <div className="flex min-h-[116px] flex-1 flex-col justify-between gap-3 p-3 sm:min-h-[132px] sm:p-4">
        <div className="min-w-0">
          <h2 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 sm:min-h-[3rem] sm:text-base sm:leading-6">
            {movie.title}
          </h2>
          <p className="mt-1 truncate text-sm text-stone-400">{movie.releaseYear || 'Year unavailable'}</p>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="flex min-w-0 items-center gap-1 text-amber-300">
            <Star className="h-4 w-4 shrink-0 fill-current" />
            {rating}
          </span>
          <button
            type="button"
            onClick={handleFavoriteClick}
            disabled={isBusy}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`rounded-md border p-2 transition disabled:cursor-wait disabled:opacity-60 ${
              isFavorite
                ? 'border-rose-400 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25'
                : 'border-white/10 text-stone-300 hover:border-rose-400 hover:text-rose-300'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
