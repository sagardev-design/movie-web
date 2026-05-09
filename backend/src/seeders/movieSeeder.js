import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB } from '../config/db.js';
import Favorite from '../models/Favorite.js';
import Movie, { createMovieRecord } from '../models/Movie.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

const movies = [
  {
    title: 'Arrival',
    overview: 'A linguist works with the military to communicate with alien visitors.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
    releaseYear: 2016,
    genre: ['Drama', 'Sci-Fi'],
    director: 'Denis Villeneuve',
    cast: ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker'],
    runtime: 116,
    rating: 7.9,
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    overview: 'Teen Miles Morales becomes Spider-Man and joins heroes from other dimensions.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    releaseYear: 2018,
    genre: ['Animation', 'Action', 'Adventure'],
    director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
    cast: ['Shameik Moore', 'Jake Johnson', 'Hailee Steinfeld'],
    runtime: 117,
    rating: 8.4,
  },
];

await connectDB();
await Favorite.deleteMany({});
await Movie.deleteMany({});

for (const movie of movies) {
  await createMovieRecord(movie);
}

console.log('Movie seed data imported');
process.exit();
