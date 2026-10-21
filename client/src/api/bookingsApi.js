import api from './client';

export const getAvailability = async (serviceId, date) => {
  const { data } = await api.get(`/bookings/availability/${serviceId}`, { params: { date } });
  return data;
};

export const createBooking = async ({ serviceId, date, time, notes }) => {
  const { data } = await api.post('/bookings', { serviceId, date, time, notes });
  return data;
};

export const getMyBookings = async () => {
  const { data } = await api.get('/bookings/my');
  return data;
};

export const rescheduleBooking = async (bookingId, { date, time }) => {
  const { data } = await api.put(`/bookings/${bookingId}`, { date, time });
  return data;
};

export const cancelBooking = async (bookingId) => {
  const { data } = await api.patch(`/bookings/${bookingId}/cancel`);
  return data;
};
