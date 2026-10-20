import mongoose from 'mongoose';
import { TIME_SLOTS } from '../utils/timeSlots.js';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in the format YYYY-MM-DD'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      enum: { values: TIME_SLOTS, message: 'Please choose a valid time slot' },
    },
    status: {
      type: String,
      enum: ['booked', 'cancelled'],
      default: 'booked',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes can be at most 500 characters'],
    },
  },
  { timestamps: true },
);

bookingSchema.index(
  { service: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { status: 'booked' } },
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
