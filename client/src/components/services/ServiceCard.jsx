import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import SubjectIcon from './SubjectIcon';
import { formatPrice, formatDuration } from '../../utils/format';
import './ServiceCard.css';

export default function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service._id}`} className="service-card">
      <div className="service-card-top">
        <SubjectIcon subject={service.subject} />
        <span className="pill pill-muted">{service.level}</span>
      </div>

      <h3>{service.title}</h3>

      <p className="service-card-meta">
        <span>{service.subject}</span>
        <span aria-hidden="true">·</span>
        <Clock size={14} />
        <span>{formatDuration(service.durationMinutes)}</span>
      </p>

      <p className="service-card-desc">{service.description}</p>
      <p className="service-card-tutor">with {service.tutorName}</p>

      <div className="service-card-footer">
        <span className="service-card-price">{formatPrice(service.price)}</span>
        <span className="service-card-link">
          View details <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
