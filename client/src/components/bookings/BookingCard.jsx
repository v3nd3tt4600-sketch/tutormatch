import { CalendarDays, Clock, User } from 'lucide-react';
import SubjectIcon from '../services/SubjectIcon';
import { formatDateShort, formatTime, isPastBooking } from '../../utils/dates';
import { formatDuration } from '../../utils/format';

const getStatus = (booking) => {
  if (booking.status === 'cancelled') return { label: 'Cancelled', className: 'pill-danger' };
  if (isPastBooking(booking)) return { label: 'Completed', className: 'pill-success' };
  return { label: 'Upcoming', className: '' };
};

export default function BookingCard({ booking, onReschedule, onCancel }) {
  const service = booking.service;
  const status = getStatus(booking);
  const canChange = status.label === 'Upcoming';

  return (
    <article className={`booking-card card ${booking.status === 'cancelled' ? 'is-cancelled' : ''}`}>
      <div className="booking-card-main">
        <SubjectIcon subject={service?.subject} />

        <div className="booking-card-info">
          <div className="booking-card-title">
            <h3>{service?.title || 'Service no longer available'}</h3>
            <span className={`pill ${status.className}`}>{status.label}</span>
          </div>

          <p className="booking-card-meta">
            <span><CalendarDays size={15} /> {formatDateShort(booking.date)}</span>
            <span>
              <Clock size={15} /> {formatTime(booking.time)}
              {service && ` · ${formatDuration(service.durationMinutes)}`}
            </span>
            {service && <span><User size={15} /> {service.tutorName}</span>}
          </p>

          {booking.notes && <p className="booking-card-notes">"{booking.notes}"</p>}
        </div>
      </div>

      {canChange && (
        <div className="booking-card-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onReschedule(booking)}>
            Reschedule
          </button>
          <button type="button" className="btn btn-danger btn-sm" onClick={() => onCancel(booking)}>
            Cancel
          </button>
        </div>
      )}
    </article>
  );
}
