import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { HttpError } from '../utils/httpError.js';
import { TIME_SLOTS, isValidDate, isInPast } from '../utils/timeSlots.js';

const SERVICE_FIELDS = 'title subject level durationMinutes price tutorName';

const validateDateAndTime = (date, time) => {
  if (!date || !time) {
    throw new HttpError(400, 'Date and time are required');
  }
  if (!isValidDate(date)) {
    throw new HttpError(400, 'Date must be a real date in the format YYYY-MM-DD');
  }
  if (!TIME_SLOTS.includes(time)) {
    throw new HttpError(400, 'Please choose a valid time slot');
  }
  if (isInPast(date, time)) {
    throw new HttpError(400, 'You can only book a time in the future');
  }
};

const findActiveService = async (serviceId) => {
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    throw new HttpError(404, 'Service not found');
  }
  return service;
};

const checkSlotIsFree = async ({ serviceId, date, time, userId, excludeId }) => {
  const notThisBooking = excludeId ? { _id: { $ne: excludeId } } : {};

  const slotTaken = await Booking.exists({
    service: serviceId,
    date,
    time,
    status: 'booked',
    ...notThisBooking,
  });
  if (slotTaken) {
    throw new HttpError(409, 'This time slot is already booked. Please pick another time.');
  }

  const userBusy = await Booking.exists({
    user: userId,
    date,
    time,
    status: 'booked',
    ...notThisBooking,
  });
  if (userBusy) {
    throw new HttpError(409, 'You already have a session booked at this time.');
  }
};

const saveBooking = async (booking) => {
  try {
    await booking.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new HttpError(409, 'Sorry, this time slot was just booked. Please pick another time.');
    }
    throw error;
  }
};

const findOwnBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new HttpError(404, 'Booking not found');
  }
  if (booking.user.toString() !== userId.toString()) {
    throw new HttpError(403, 'You can only change your own bookings');
  }
  return booking;
};

const checkCanBeChanged = (booking) => {
  if (booking.status === 'cancelled') {
    throw new HttpError(400, 'This booking is already cancelled');
  }
  if (isInPast(booking.date, booking.time)) {
    throw new HttpError(400, 'Past sessions cannot be changed');
  }
};

// GET /api/bookings/availability/:serviceId?date=YYYY-MM-DD (public)
export const getAvailability = async (req, res) => {
  const { date } = req.query;
  if (!isValidDate(date)) {
    throw new HttpError(400, 'Please provide a date in the format YYYY-MM-DD');
  }

  await findActiveService(req.params.serviceId);

  const bookings = await Booking.find({
    service: req.params.serviceId,
    date,
    status: 'booked',
  }).select('time');

  const takenTimes = new Set(bookings.map((booking) => booking.time));
  const slots = TIME_SLOTS.map((time) => ({
    time,
    available: !takenTimes.has(time) && !isInPast(date, time),
  }));

  res.json({ date, slots });
};

// POST /api/bookings (logged in)
export const createBooking = async (req, res) => {
  const { serviceId, date, time, notes } = req.body ?? {};

  if (!serviceId) {
    throw new HttpError(400, 'Please choose a service');
  }
  validateDateAndTime(date, time);
  await findActiveService(serviceId);
  await checkSlotIsFree({ serviceId, date, time, userId: req.user._id });

  const booking = new Booking({
    user: req.user._id,
    service: serviceId,
    date,
    time,
    notes,
  });
  await saveBooking(booking);
  await booking.populate('service', SERVICE_FIELDS);

  res.status(201).json({ booking });
};

// GET /api/bookings/my (logged in)
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('service', SERVICE_FIELDS)
    .sort({ date: 1, time: 1 });

  res.json({ count: bookings.length, bookings });
};

// PUT /api/bookings/:id (owner) — reschedule
export const rescheduleBooking = async (req, res) => {
  const { date, time, notes } = req.body ?? {};

  const booking = await findOwnBooking(req.params.id, req.user._id);
  checkCanBeChanged(booking);
  validateDateAndTime(date, time);

  if (booking.date === date && booking.time === time) {
    throw new HttpError(400, 'Please choose a different date or time');
  }

  await checkSlotIsFree({
    serviceId: booking.service,
    date,
    time,
    userId: req.user._id,
    excludeId: booking._id,
  });

  booking.date = date;
  booking.time = time;
  if (notes !== undefined) booking.notes = notes;

  await saveBooking(booking);
  await booking.populate('service', SERVICE_FIELDS);

  res.json({ booking });
};

// PATCH /api/bookings/:id/cancel (owner)
export const cancelBooking = async (req, res) => {
  const booking = await findOwnBooking(req.params.id, req.user._id);
  checkCanBeChanged(booking);

  booking.status = 'cancelled';
  await booking.save();
  await booking.populate('service', SERVICE_FIELDS);

  res.json({ booking });
};
