import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getServices } from '../../api/servicesApi';
import ServiceCard from '../services/ServiceCard';
import Spinner from '../common/Spinner';

const pickFeatured = (services) => {
  const seenSubjects = new Set();
  return services
    .filter((service) => {
      if (seenSubjects.has(service.subject)) return false;
      seenSubjects.add(service.subject);
      return true;
    })
    .slice(0, 3);
};

export default function FeaturedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    getServices()
      .then((data) => {
        if (active) setServices(pickFeatured(data.services));
      })
      .catch((error) => {
        console.error('Unable to load featured services:', error);
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (failed || (!loading && services.length === 0)) return null;

  return (
    <section className="container home-section">
      <div className="section-header">
        <h2>Featured sessions</h2>
        <Link to="/services">
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading sessions…" />
      ) : (
        <div className="featured-grid">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </section>
  );
}
