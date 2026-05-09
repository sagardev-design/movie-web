import MovieCard from './MovieCard';

export default function MovieGrid({ favoriteActionLoadingId, favorites = [], movies, onFavoriteToggle }) {
  if (!movies.length) {
    return <p className="py-16 text-center text-stone-400">No movies found.</p>;
  }

  return (
    <section className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => {
        const movieId = movie.tmdbId || movie.id;
        const isFavorite = favorites.some((favorite) => isSameMovie(favorite, movie));

        return (
          <MovieCard
            key={movie._id || movie.id}
            favoriteActionLoadingId={favoriteActionLoadingId}
            isBusy={favoriteActionLoadingId === String(movieId)}
            isFavorite={isFavorite}
            movie={movie}
            onFavoriteToggle={onFavoriteToggle}
          />
        );
      })}
    </section>
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
