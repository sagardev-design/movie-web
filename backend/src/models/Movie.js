import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      unique: true,
      sparse: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    overview: {
      type: String,
      default: '',
    },
    posterUrl: String,
    backdropUrl: String,
    releaseYear: Number,
    genre: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    director: String,
    cast: {
      type: [String],
      default: [],
    },
    runtime: Number,
    rating: Number,
  },
  { timestamps: true },
);

movieSchema.index({ title: 'text', overview: 'text' });

const Movie = mongoose.model('Movie', movieSchema);

export async function findMovies({ search, genre, year, page = 1, limit = 20, sortBy, sortOrder = 'desc' }) {
  const filter = {};

  if (search) {
    filter.$or = [{ title: { $regex: search, $options: 'i' } }, { overview: { $regex: search, $options: 'i' } }];
  }

  if (genre) {
    filter.genre = genre;
  }

  if (year) {
    filter.releaseYear = Number(year);
  }

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (pageNumber - 1) * limitNumber;
  const sort = sortBy === 'year' ? { releaseYear: sortOrder === 'asc' ? 1 : -1 } : { createdAt: -1 };

  const [movies, total] = await Promise.all([
    Movie.find(filter).sort(sort).skip(skip).limit(limitNumber),
    Movie.countDocuments(filter),
  ]);

  return {
    movies: movies.map(mapMovie),
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber) || 1,
    },
  };
}

export async function findMovieById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const movie = await Movie.findById(id);
  return mapMovie(movie);
}

export async function findMovieByTmdbId(tmdbId) {
  const movie = await Movie.findOne({ tmdbId: Number(tmdbId) });
  return mapMovie(movie);
}

export async function createMovieRecord(movie) {
  const createdMovie = await Movie.create(serializeMovie(movie));
  return mapMovie(createdMovie);
}

export async function upsertTmdbMovieRecord(movie) {
  const tmdbId = movie.tmdbId || movie.id;
  const savedMovie = await Movie.findOneAndUpdate(
    { tmdbId },
    { $set: serializeMovie({ ...movie, tmdbId }) },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return mapMovie(savedMovie);
}

export function mapMovie(movie) {
  if (!movie) return null;

  return {
    id: movie.tmdbId || movie._id.toString(),
    _id: movie._id.toString(),
    tmdbId: movie.tmdbId,
    title: movie.title,
    overview: movie.overview,
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    releaseYear: movie.releaseYear,
    genre: movie.genre || [],
    director: movie.director,
    cast: movie.cast || [],
    runtime: movie.runtime,
    rating: movie.rating === null || movie.rating === undefined ? null : Number(movie.rating),
    createdAt: movie.createdAt,
    updatedAt: movie.updatedAt,
  };
}

function serializeMovie(movie) {
  return {
    tmdbId: movie.tmdbId || movie.id || undefined,
    title: movie.title,
    overview: movie.overview || '',
    posterUrl: movie.posterUrl || null,
    backdropUrl: movie.backdropUrl || null,
    releaseYear: movie.releaseYear || null,
    genre: movie.genre || [],
    director: movie.director || null,
    cast: movie.cast || [],
    runtime: movie.runtime || null,
    rating: movie.rating ?? null,
  };
}

export default Movie;
