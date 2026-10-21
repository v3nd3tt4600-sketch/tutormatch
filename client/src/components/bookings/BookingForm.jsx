import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { createBooking } from '../../api/bookingsApi';
import { getErrorMessage } from '../../api/client';
import TimeSlotPicker from './TimeSlotPicker';
import ErrorMessage from '../common/ErrorMessage';
import { getTodayString, formatDateLong, formatTime } from '../../utils/dates';
import './Bookings.css';

const NOTES_MAX = 500;

export default function BookingForm({ service }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateChange = (event) => {
    setDate(event.target.value);
    setTime('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!date || !time) {
      setError('Pick a date and a time slot first.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await createBooking({
        serviceId: service._id,
        date,
        time,
        notes: notes.trim() || undefined,
      });
      setConfirmedBooking(data.booking);
    } catch (err) {
      setError(getErrorMessage(err));
      setTime('');
      setRefreshKey((key) => key + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setConfirmedBooking(null);
    setDate('');
    setTime('');
    setNotes('');
  };

  if (confirmedBooking) {
    return (
      <div className="booking-confirmed">
        <CheckCircle2 size={40} />
        <h3>You're booked</h3>
        <p>
          {formatDateLong(confirmedBooking.date)}
          <br />
          at {formatTime(confirmedBooking.time)}
        </p>
        <Link to="/dashboard" className="btn btn-primary btn-block">Go to my dashboard</Link>
        <button type="button" className="btn btn-secondary btn-block" onClick={resetForm}>
          Book another time
        </button>
      </div>
    );
  }

  return (
    <form className="form booking-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="booking-date">Date</label>
        <input
          id="booking-date"
          type="date"
          className="input"
          min={getTodayString()}
          value={date}
          onChange={handleDateChange}
        />
      </div>

      <div className="form-group">
        <span className="form-label">Time</span>
        <TimeSlotPicker
          serviceId={service._id}
          date={date}
          selectedTime={time}
          onSelect={(selected) => {
            setTime(selected);
            setError('');
          }}
          refreshKey={refreshKey}
        />
      </div>

      <div className="form-group">
        <label htmlFor="booking-notes">What do you want to focus on? (optional)</label>
        <textarea
          id="booking-notes"
          className="input"
          rows={3}
          maxLength={NOTES_MAX}
          placeholder="I keep getting stuck on the chain rule"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <span className="notes-counter">{notes.length}/{NOTES_MAX}</span>
      </div>

      <ErrorMessage message={error} />

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? 'Booking…' : 'Book session'}
      </button>
    </form>
  );
}
