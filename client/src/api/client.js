import axios from 'axios';

export const TOKEN_KEY = 'tutormatch_token';

// One axios instance for the whole app, pointing at our backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Before every request: if we have a token, attach it
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Turns any axios error into a message we can show the user.
// Our backend always sends errors as { message: '...' }.
export const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong';

export default api;
