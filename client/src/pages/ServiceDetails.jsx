import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, GraduationCap, Tag, User } from 'lucide-react';
import { getServiceById } from '../api/servicesApi';
import { getErrorMessage } from '../api/client';
import useAuth from '../hooks/useAuth';
import usePageTitle from '../hooks/usePageTitle';
import SubjectIcon from '../components/services/SubjectIcon';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import BookingForm from '../components/bookings/BookingForm';
import { formatPrice, formatDuration } from '../utils/format';
import './ServiceDetails.css';

export default function ServiceDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const [result, setResult] = useState({ id: null, service: null, error: '' });
  const loading = result.id !== id;
  const service = loading ? null : result.service;
  const error = loading ? '' : result.error;

  usePageTitle(service?.title || 'Service details');

  useEffect(() => {
    let ignore = false;

    getServiceById(id)
      .then((data) => {
        if (!ignore) setResult({ id, service: data.service, error: '' });
      })
      .catch((err) => {
        if (!ignore) setResult({ id, service: null, error: getErrorMessage(err) });
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const backLink = (
    <Link to="/services" className="back-link">
      <ArrowLeft size={16} />
      All services
    </Link>
  );

  if (loading) {
    return <div className="page container"><Spinner label="Loading service…" /></div>;
  }

  if (error) {
    return (
      <div className="page container">
        {backLink}
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="page container">
      {backLink}

      <div className="details-layout">
        <section className="card details-main">
          <div className="details-header">
            <SubjectIcon subject={service.subject} large />
            <div>
              <p className="details-subject">{service.subject}</p>
              <h1>{service.title}</h1>
            </div>
          </div>

          <div className="details-facts">
            <div className="fact">
              <span className="fact-label"><GraduationCap size={14} /> Level</span>
              <span className="fact-value">{service.level}</span>
            </div>
            <div className="fact">
              <span className="fact-label"><Clock size={14} /> Duration</span>
              <span className="fact-value">{formatDuration(service.durationMinutes)}</span>
            </div>
            <div className="fact">
              <span className="fact-label"><User size={14} /> Tutor</span>
              <span className="fact-value">{service.tutorName}</span>
            </div>
            <div className="fact">
              <span className="fact-label"><Tag size={14} /> Price</span>
              <span className="fact-value">{formatPrice(service.price)}</span>
            </div>
          </div>

          <h2>About this session</h2>
          <p>{service.description}</p>

          <h2>How it works</h2>
          <ol>
            <li>Pick a date and an open time slot.</li>
            <li>Add a note about what you want to focus on.</li>
            <li>Meet your tutor at the booked time.</li>
            <li>Need to change plans? Reschedule or cancel from your dashboard before the session starts.</li>
          </ol>
        </section>

        <aside className="card details-side">
          <p className="details-price">{formatPrice(service.price)}</p>
          <p className="text-muted">per {formatDuration(service.durationMinutes)} session</p>

          {isLoggedIn ? (
            <BookingForm service={service} />
          ) : (
            <>
              <Link to="/login" state={{ from: location.pathname }} className="btn btn-primary btn-block">
                Log in to book
              </Link>
              <p className="details-side-note">
                New here? <Link to="/register" state={{ from: location.pathname }}>Create a free account</Link>
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
