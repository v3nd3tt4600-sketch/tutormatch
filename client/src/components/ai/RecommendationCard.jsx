import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SubjectIcon from '../services/SubjectIcon';
import { formatPrice, formatDuration } from '../../utils/format';

export default function RecommendationCard({ recommendation, rank }) {
  const { service, matchLevel, reason } = recommendation;
  const isStrong = matchLevel === 'strong';

  return (
    <article className="card recommendation-card">
      <div className="recommendation-header">
        <span className="recommendation-rank">{rank}</span>
        <SubjectIcon subject={service.subject} />
        <div className="recommendation-title">
          <h3>{service.title}</h3>
          <p className="text-muted">
            {service.subject} · {service.level} · {formatDuration(service.durationMinutes)} ·{' '}
            {formatPrice(service.price)} · with {service.tutorName}
          </p>
        </div>
        <span className={`pill ${isStrong ? 'pill-success' : ''}`}>
          {isStrong ? 'Strong match' : 'Good match'}
        </span>
      </div>

      <p className="recommendation-reason">{reason}</p>

      <Link to={`/services/${service._id}`} className="btn btn-primary btn-sm recommendation-cta">
        Book this session <ArrowRight size={16} />
      </Link>
    </article>
  );
}
