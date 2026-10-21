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

// Includes inactive (hidden) services
export const getAllServicesAdmin = async () => {
  const { data } = await api.get('/services/admin/all');
  return data;
};

export const createService = async (service) => {
  const { data } = await api.post('/services', service);
  return data;
};

export const updateService = async (id, changes) => {
  const { data } = await api.put(`/services/${id}`, changes);
  return data;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/services/${id}`);
  return data;
};
