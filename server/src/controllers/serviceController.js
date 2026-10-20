import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { HttpError } from '../utils/httpError.js';

const ALLOWED_FIELDS = [
  'title',
  'subject',
  'level',
  'description',
  'durationMinutes',
  'price',
  'tutorName',
  'isActive',
];

const pickServiceFields = (body) => {
  const fields = {};
  if (!body || typeof body !== 'object' || Array.isArray(body)) return fields;

  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) fields[key] = body[key];
  }
  return fields;
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/services?subject=Math&level=College&search=calculus (public)
export const getServices = async (req, res) => {
  const { subject, level, search } = req.query;
  const filter = { isActive: true };

  if (subject) filter.subject = subject;
  if (level) filter.level = level;
  if (search) {
    const pattern = new RegExp(escapeRegex(String(search)), 'i');
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  const services = await Service.find(filter).sort({ subject: 1, title: 1 });
  res.json({ count: services.length, services });
};

// GET /api/services/admin/all (admin) — includes inactive services
export const getAllServicesAdmin = async (req, res) => {
  const services = await Service.find().sort({ subject: 1, title: 1 });
  res.json({ count: services.length, services });
};

// GET /api/services/:id (public)
export const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service || !service.isActive) {
    throw new HttpError(404, 'Service not found');
  }

  res.json({ service });
};

// POST /api/services (admin)
export const createService = async (req, res) => {
  const service = await Service.create(pickServiceFields(req.body));
  res.status(201).json({ service });
};

// PUT /api/services/:id (admin)
export const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new HttpError(404, 'Service not found');
  }

  Object.assign(service, pickServiceFields(req.body));
  await service.save();

  res.json({ service });
};

// DELETE /api/services/:id (admin)
export const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new HttpError(404, 'Service not found');
  }

  const hasBookings = await Booking.exists({ service: service._id });
  if (hasBookings) {
    throw new HttpError(
      400,
      'This service has bookings and cannot be deleted. Deactivate it instead.',
    );
  }

  await service.deleteOne();
  res.json({ message: 'Service deleted' });
};
