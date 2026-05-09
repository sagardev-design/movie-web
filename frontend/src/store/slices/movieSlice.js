import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import movieService from '../../services/movieService';

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (params, thunkApi) => {
  try {
    return await movieService.getMovies(params);
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, 'Unable to fetch movies'));
  }
});

export const fetchMovieById = createAsyncThunk('movies/fetchMovieById', async (id, thunkApi) => {
  try {
    return await movieService.getMovieById(id);
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, 'Unable to fetch movie'));
  }
});

export const fetchFavorites = createAsyncThunk('movies/fetchFavorites', async (_, thunkApi) => {
  try {
    return await movieService.getFavorites();
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, 'Unable to fetch favorites'));
  }
});

export const addFavoriteMovie = createAsyncThunk('movies/addFavoriteMovie', async (movieId, thunkApi) => {
  try {
    return await movieService.addFavorite(movieId);
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, 'Unable to add favorite'));
  }
});

export const removeFavoriteMovie = createAsyncThunk('movies/removeFavoriteMovie', async (movieId, thunkApi) => {
  try {
    return await movieService.removeFavorite(movieId);
  } catch (error) {
    return thunkApi.rejectWithValue(getApiError(error, 'Unable to remove favorite'));
  }
});

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 1,
    },
    favorites: [],
    selectedMovie: null,
    isLoading: false,
    isFavoritesLoading: false,
    favoriteActionLoadingId: null,
    error: null,
    favoritesError: null,
  },
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.favorites.some((movie) => movie._id === action.payload._id);
      if (!exists) state.favorites.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter((movie) => movie._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movies = action.payload.data;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.isFavoritesLoading = true;
        state.favoritesError = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isFavoritesLoading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isFavoritesLoading = false;
        state.favoritesError = action.payload;
      })
      .addCase(addFavoriteMovie.pending, (state, action) => {
        state.favoriteActionLoadingId = String(action.meta.arg);
        state.favoritesError = null;
      })
      .addCase(addFavoriteMovie.fulfilled, (state, action) => {
        state.favoriteActionLoadingId = null;
        const exists = state.favorites.some((movie) => sameMovie(movie, action.payload));
        if (!exists) state.favorites.push(action.payload);
      })
      .addCase(addFavoriteMovie.rejected, (state, action) => {
        state.favoriteActionLoadingId = null;
        state.favoritesError = action.payload;
      })
      .addCase(removeFavoriteMovie.pending, (state, action) => {
        state.favoriteActionLoadingId = String(action.meta.arg);
        state.favoritesError = null;
      })
      .addCase(removeFavoriteMovie.fulfilled, (state, action) => {
        state.favoriteActionLoadingId = null;
        state.favorites = state.favorites.filter((movie) => !matchesMovieId(movie, action.payload));
      })
      .addCase(removeFavoriteMovie.rejected, (state, action) => {
        state.favoriteActionLoadingId = null;
        state.favoritesError = action.payload;
      });
  },
});

export const { addFavorite, removeFavorite } = movieSlice.actions;
export default movieSlice.reducer;

function getApiError(error, fallback) {
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Check that the backend is running and responding.';
  }

  if (error.response?.status === 401) {
    return 'Your session was not accepted by the backend. Sign out, sign in again, and check Clerk backend keys.';
  }

  return error.response?.data?.message || error.message || fallback;
}

function sameMovie(firstMovie, secondMovie) {
  return (
    firstMovie.id === secondMovie.id ||
    firstMovie.tmdbId === secondMovie.tmdbId ||
    firstMovie.id === secondMovie.tmdbId ||
    firstMovie.tmdbId === secondMovie.id
  );
}

function matchesMovieId(movie, movieId) {
  const id = String(movieId);
  return String(movie.id) === id || String(movie.tmdbId) === id;
}
