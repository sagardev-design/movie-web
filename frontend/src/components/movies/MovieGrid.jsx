import MovieCard from './MovieCard';

export default function MovieGrid({ movies }) {
  if (!movies.length) {
    return <p className="py-16 text-center text-stone-400">No movies found.</p>;
  }

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie._id || movie.id} movie={movie} />
      ))}
    </section>
  );
}
