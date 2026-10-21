import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarClock,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { getMyBookings, cancelBooking } from '../api/bookingsApi';
import { getErrorMessage } from '../api/client';
import useAuth from '../hooks/useAuth';
import usePageTitle from '../hooks/usePageTitle';
import BookingCard from '../components/bookings/BookingCard';
import RescheduleModal from '../components/bookings/RescheduleModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatCard from '../components/dashboard/StatCard';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { isUpcomingBooking, formatDateLong, formatTime } from '../utils/dates';
import './Dashboard.css';

const sortKey = (booking) => `${booking.date}T${booking.time}`;

export default function Dashboard() {
  usePageTitle('My dashboard');
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('upcoming');
  const [rescheduling, setRescheduling] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let ignore = false;
    getMyBookings()
      .then((data) => {
        if (!ignore) setBookings(data.bookings);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => setSuccessMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const replaceBooking = (updated) => {
    setBookings((previous) => previous.map((booking) =>
      (booking._id === updated._id ? updated : booking)));
  };

  const handleRescheduled = (updated) => {
    replaceBooking(updated);
    setRescheduling(null);
    setSuccessMessage(`Rescheduled to ${formatDateLong(updated.date)} at ${formatTime(updated.time)}.`);
  };

  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    setCancelError('');
    try {
      const data = await cancelBooking(cancelling._id);
      replaceBooking(data.booking);
      setCancelling(null);
      setSuccessMessage('Your booking was cancelled.');
    } catch (err) {
      setCancelError(getErrorMessage(err));
    } finally {
      setCancelLoading(false);
    }
  };

  const closeCancelDialog = () => {
    setCancelling(null);
    setCancelError('');
  };

  const upcoming = bookings
    .filter(isUpcomingBooking)
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  const past = bookings
    .filter((booking) => !isUpcomingBooking(booking))
    .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
  const completedCount = past.filter((booking) => booking.status === 'booked').length;
  const cancelledCount = past.filter((booking) => booking.status === 'cancelled').length;
  const nextSession = upcoming[0];
  const visibleBookings = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="page container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Hi, {user.name.split(' ')[0]}</h1>
          <p className="page-subtitle">Here's an overview of your tutoring sessions.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/advisor" className="btn btn-secondary">
            <Sparkles size={18} /> Ask the AI Advisor
          </Link>
          <Link to="/services" className="btn btn-primary">
            <CalendarPlus size={18} /> Book a session
          </Link>
        </div>
      </div>

      {loading && <Spinner label="Loading your bookings…" />}
      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            <StatCard icon={CalendarClock} label="Upcoming" value={upcoming.length} />
            <StatCard icon={CalendarCheck} label="Completed" value={completedCount} />
            <StatCard icon={CalendarX} label="Cancelled" value={cancelledCount} />
          </div>

          {nextSession && (
            <div className="next-session">
              <CalendarClock size={22} />
              <p>
                <strong>Next session:</strong> {nextSession.service?.title} on{' '}
                {formatDateLong(nextSession.date)} at {formatTime(nextSession.time)}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success dashboard-alert" role="status">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'upcoming'}
              className={`tab ${tab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setTab('upcoming')}
            >
              Upcoming ({upcoming.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'past'}
              className={`tab ${tab === 'past' ? 'active' : ''}`}
              onClick={() => setTab('past')}
            >
              Past and cancelled ({past.length})
            </button>
          </div>

          {visibleBookings.length === 0 ? (
            <div className="empty-state card">
              <CalendarPlus size={36} />
              <h2>{tab === 'upcoming' ? 'No upcoming sessions' : 'No past sessions yet'}</h2>
              <p>
                {tab === 'upcoming'
                  ? 'Find a session that fits what you are studying, or let the AI Advisor suggest one.'
                  : 'Sessions you finish or cancel will show up here.'}
              </p>
              {tab === 'upcoming' && (
                <Link to="/services" className="btn btn-primary">Browse services</Link>
              )}
            </div>
          ) : (
            <div className="bookings-list">
              {visibleBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onReschedule={setRescheduling}
                  onCancel={setCancelling}
                />
              ))}
            </div>
          )}
        </>
      )}

      {rescheduling && (
        <RescheduleModal
          booking={rescheduling}
          onClose={() => setRescheduling(null)}
          onRescheduled={handleRescheduled}
        />
      )}

      {cancelling && (
        <ConfirmDialog
          title="Cancel this session?"
          message={`${cancelling.service?.title} on ${formatDateLong(cancelling.date)} at ${formatTime(cancelling.time)} will be cancelled and the time slot released.`}
          confirmLabel="Cancel session"
          danger
          loading={cancelLoading}
          error={cancelError}
          onConfirm={handleConfirmCancel}
          onClose={closeCancelDialog}
        />
      )}
    </div>
  );
}
