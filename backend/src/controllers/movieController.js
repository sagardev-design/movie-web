import asyncHandler from 'express-async-handler';
import { findMovieById, findMovieByTmdbId, findMovies } from '../models/Movie.js';
import { getPopularMovies, getTmdbMovieById, searchMovies } from '../services/tmdbService.js';

export const getMovies = asyncHandler(async (req, res) => {
  const { search, genre, year, page = 1, limit = 20, sortBy, sortOrder = 'desc' } = req.query;
  const { movies, pagination } = process.env.TMDB_API_KEY
    ? search
      ? await searchMovies({ search, page, year })
      : await getPopularMovies({ page, sortBy, sortOrder })
    : await findMovies({ search, genre, year, page, limit, sortBy, sortOrder });

  const sortedMovies = sortMovies(movies, { sortBy, sortOrder });

  res.json({
    data: sortedMovies,
    pagination,
  });
});

export const getMovieById = asyncHandler(async (req, res) => {
  const movie = process.env.TMDB_API_KEY
    ? await getTmdbMovieById(req.params.id)
    : (await findMovieByTmdbId(req.params.id)) || (await findMovieById(req.params.id));

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  res.json({ data: movie });
});

function sortMovies(movies, { sortBy, sortOrder }) {
  if (sortBy !== 'year') return movies;

  const direction = sortOrder === 'asc' ? 1 : -1;

  return [...movies].sort((firstMovie, secondMovie) => {
    const firstYear = firstMovie.releaseYear ?? (sortOrder === 'asc' ? Number.MAX_SAFE_INTEGER : 0);
    const secondYear = secondMovie.releaseYear ?? (sortOrder === 'asc' ? Number.MAX_SAFE_INTEGER : 0);
    return (firstYear - secondYear) * direction;
  });
}
