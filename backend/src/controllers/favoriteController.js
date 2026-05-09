import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Favorite from '../models/Favorite.js';
import Movie, { mapMovie, upsertTmdbMovieRecord } from '../models/Movie.js';
import { getTmdbMovieById } from '../services/tmdbService.js';

export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('movie');

  res.json({ data: favorites.map((favorite) => mapMovie(favorite.movie)).filter(Boolean) });
});

export const addFavorite = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const tmdbMovie = await getTmdbMovieById(movieId);
  const movie = await upsertTmdbMovieRecord(tmdbMovie);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  await Favorite.updateOne(
    { user: req.user.id, movie: movie._id },
    { $setOnInsert: { user: req.user.id, movie: movie._id } },
    { upsert: true },
  );

  res.status(201).json({ data: movie });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const movieFilter = mongoose.Types.ObjectId.isValid(movieId) ? { _id: movieId } : { tmdbId: Number(movieId) };
  const movie = await Movie.findOne(movieFilter);

  if (movie) {
    await Favorite.deleteOne({ user: req.user.id, movie: movie._id });
  }

  res.json({ message: 'Favorite removed' });
});
