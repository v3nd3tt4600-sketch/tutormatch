import api from './client';

// params can include subject, level and search
export const getServices = async (params = {}) => {
  const { data } = await api.get('/services', { params });
  return data;
};

export const getServiceById = async (id) => {
  const { data } = await api.get(`/services/${id}`);
  return data;
};
