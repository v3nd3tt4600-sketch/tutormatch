const pad = (number) => String(number).padStart(2, '0');

export const getTodayString = () => {
  const date = new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const getNowString = () => {
  const date = new Date();
  return `${getTodayString()}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const isPastBooking = (booking) => `${booking.date}T${booking.time}` <= getNowString();

export const isUpcomingBooking = (booking) =>
  booking.status === 'booked' && !isPastBooking(booking);

const toLocalDate = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDateLong = (date) =>
  toLocalDate(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const formatDateShort = (date) =>
  toLocalDate(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${pad(minutes)} ${period}`;
};
