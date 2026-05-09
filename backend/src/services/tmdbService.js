import axios from 'axios';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

const tmdb = axios.create({
  baseURL: TMDB_API_URL,
  timeout: 10000,
});

tmdb.interceptors.request.use((config) => {
  if (!process.env.TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is missing. Add it to backend/.env');
  }

  config.params = {
    api_key: process.env.TMDB_API_KEY,
    language: 'en-US',
    ...config.params,
  };

  return config;
});

export async function getPopularMovies({ page = 1, sortBy, sortOrder = 'desc' } = {}) {
  const isYearSort = sortBy === 'year';
  const response = await tmdb.get(isYearSort ? '/discover/movie' : '/movie/popular', {
    params: {
      page,
      include_adult: false,
      include_video: false,
      sort_by: isYearSort ? `primary_release_date.${sortOrder === 'asc' ? 'asc' : 'desc'}` : undefined,
      'vote_count.gte': isYearSort ? 50 : undefined,
    },
  });

  return mapPagedResponse(response.data);
}

export async function searchMovies({ search, page = 1, year } = {}) {
  const response = await tmdb.get('/search/movie', {
    params: {
      query: search,
      page,
      year,
      include_adult: false,
    },
  });

  return mapPagedResponse(response.data);
}

export async function getTmdbMovieById(id) {
  const response = await tmdb.get(`/movie/${id}`, {
    params: {
      append_to_response: 'credits',
    },
  });

  return mapMovieDetails(response.data);
}

function mapPagedResponse(payload) {
  return {
    movies: payload.results.map(mapMovieListItem),
    pagination: {
      page: payload.page,
      limit: payload.results.length,
      total: payload.total_results,
      pages: payload.total_pages,
    },
  };
}

function mapMovieListItem(movie) {
  return {
    id: movie.id,
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : null,
    backdropUrl: movie.backdrop_path ? `${TMDB_BACKDROP_URL}${movie.backdrop_path}` : null,
    releaseYear: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
    genre: movie.genre_ids || [],
    director: null,
    cast: [],
    runtime: null,
    rating: movie.vote_average,
  };
}

function mapMovieDetails(movie) {
  const director = movie.credits?.crew?.find((person) => person.job === 'Director')?.name || null;
  const cast = movie.credits?.cast?.slice(0, 8).map((person) => person.name) || [];

  return {
    id: movie.id,
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : null,
    backdropUrl: movie.backdrop_path ? `${TMDB_BACKDROP_URL}${movie.backdrop_path}` : null,
    releaseYear: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
    genre: movie.genres?.map((genre) => genre.name) || [],
    director,
    cast,
    runtime: movie.runtime,
    rating: movie.vote_average,
  };
}
