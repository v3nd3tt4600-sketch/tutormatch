import express from 'express';
import {
  getAvailability,
  createBooking,
  getMyBookings,
  rescheduleBooking,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/availability/:serviceId', getAvailability);
router.get('/my', protect, getMyBookings);
router.post('/', protect, createBooking);
router.put('/:id', protect, rescheduleBooking);
router.patch('/:id/cancel', protect, cancelBooking);

export default router;
