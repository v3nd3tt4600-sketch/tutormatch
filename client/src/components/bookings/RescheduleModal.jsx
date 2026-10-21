import { useState } from 'react';
import Modal from '../common/Modal';
import ErrorMessage from '../common/ErrorMessage';
import TimeSlotPicker from './TimeSlotPicker';
import { rescheduleBooking } from '../../api/bookingsApi';
import { getErrorMessage } from '../../api/client';
import { getTodayString, formatDateLong, formatTime } from '../../utils/dates';
import './Bookings.css';

export default function RescheduleModal({ booking, onClose, onRescheduled }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!date || !time) {
      setError('Pick a new date and time first.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await rescheduleBooking(booking._id, { date, time });
      onRescheduled(data.booking);
    } catch (err) {
      setError(getErrorMessage(err));
      setTime('');
      setRefreshKey((key) => key + 1);
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`Reschedule ${booking.service?.title || 'session'}`} onClose={onClose}>
      <p className="text-muted">
        Currently booked for {formatDateLong(booking.date)} at {formatTime(booking.time)}.
      </p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="reschedule-date">New date</label>
          <input
            id="reschedule-date"
            type="date"
            className="input"
            min={getTodayString()}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setTime('');
              setError('');
            }}
          />
        </div>

        <div className="form-group">
          <span className="form-label">New time</span>
          <TimeSlotPicker
            serviceId={booking.service._id}
            date={date}
            selectedTime={time}
            onSelect={(selected) => {
              setTime(selected);
              setError('');
            }}
            refreshKey={refreshKey}
          />
        </div>

        <ErrorMessage message={error} />

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Never mind
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save new time'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
