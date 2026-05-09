import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const rating = movie.rating ? Number(movie.rating).toFixed(1) : 'N/A';

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-[#181b1f]">
      <Link to={`/movies/${movie._id || movie.id}`}>
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
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-amber-300">
            <Star className="h-4 w-4 fill-current" />
            {rating}
          </span>
          <button className="rounded-md border border-white/10 p-2 text-stone-300 transition hover:border-rose-400 hover:text-rose-300">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
