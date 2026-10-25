import api from './client';

export const getRecommendations = async (problem) => {
  const { data } = await api.post('/ai/recommend', { problem });
  return data;
};
