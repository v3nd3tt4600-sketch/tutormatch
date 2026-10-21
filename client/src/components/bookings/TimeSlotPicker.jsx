import { useEffect, useState } from 'react';
import { getAvailability } from '../../api/bookingsApi';
import { getErrorMessage } from '../../api/client';
import ErrorMessage from '../common/ErrorMessage';
import { formatTime } from '../../utils/dates';

export default function TimeSlotPicker({ serviceId, date, selectedTime, onSelect, refreshKey = 0 }) {
  const [result, setResult] = useState({ key: '', slots: [], error: '' });
  const requestKey = `${serviceId}:${date}:${refreshKey}`;
  const loading = Boolean(date) && result.key !== requestKey;
  const slots = result.key === requestKey ? result.slots : [];
  const error = result.key === requestKey ? result.error : '';

  useEffect(() => {
    if (!date) return undefined;

    let ignore = false;
    getAvailability(serviceId, date)
      .then((data) => {
        if (!ignore) setResult({ key: requestKey, slots: data.slots, error: '' });
      })
      .catch((err) => {
        if (!ignore) setResult({ key: requestKey, slots: [], error: getErrorMessage(err) });
      });

    return () => {
      ignore = true;
    };
  }, [serviceId, date, refreshKey, requestKey]);

  if (!date) return <p className="slot-hint">Pick a date to see open times.</p>;
  if (loading) return <p className="slot-hint">Checking availability…</p>;
  if (error) return <ErrorMessage message={error} />;

  if (!slots.some((slot) => slot.available)) {
    return <p className="slot-hint">No open times on this day. Try another date.</p>;
  }

  return (
    <div className="slot-grid">
      {slots.map((slot) => (
        <button
          key={slot.time}
          type="button"
          className={`slot ${selectedTime === slot.time ? 'selected' : ''}`}
          disabled={!slot.available}
          onClick={() => onSelect(slot.time)}
          aria-pressed={selectedTime === slot.time}
        >
          {formatTime(slot.time)}
        </button>
      ))}
    </div>
  );
}
