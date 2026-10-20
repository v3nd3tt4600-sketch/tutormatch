import { useEffect, useState } from 'react';
import { getServices } from '../api/servicesApi';
import { getErrorMessage } from '../api/client';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getServices()
      .then((data) => setServices(data.services))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page container">
      <h1 className="page-title">Services</h1>
      <p className="page-subtitle">API connection test: these come from your MongoDB database.</p>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}

      <ul>
        {services.map((service) => (
          <li key={service._id}>
            {service.title} ({service.subject}, ${service.price})
          </li>
        ))}
      </ul>
    </div>
  );
}
