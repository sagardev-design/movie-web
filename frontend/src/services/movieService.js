import api from './api';

const getMovies = async (params = {}) => {
  const response = await api.get('/movies', { params });
  return response.data;
};

const getMovieById = async (id) => {
  const response = await api.get(`/movies/${id}`);
  return response.data.data;
};

const getFavorites = async () => {
  const response = await api.get('/favorites');
  return response.data.data;
};

const addFavorite = async (movieId) => {
  const response = await api.post(`/favorites/${movieId}`);
  return response.data.data;
};

const removeFavorite = async (movieId) => {
  await api.delete(`/favorites/${movieId}`);
  return movieId;
};

export default {
  getMovies,
  getMovieById,
  getFavorites,
  addFavorite,
  removeFavorite,
};
