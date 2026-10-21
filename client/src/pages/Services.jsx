import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { getServices } from '../api/servicesApi';
import { getErrorMessage } from '../api/client';
import ServiceCard from '../components/services/ServiceCard';
import ServiceFilters from '../components/services/ServiceFilters';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import usePageTitle from '../hooks/usePageTitle';
import './Services.css';

export default function Services() {
  usePageTitle('Services');

  const [searchParams, setSearchParams] = useSearchParams();
  const subject = searchParams.get('subject') || '';
  const level = searchParams.get('level') || '';
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchTimer = useRef(null);
  const searchParamsRef = useRef(searchParams);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParamsRef.current);
    if (value) next.set(key, value);
    else next.delete(key);
    searchParamsRef.current = next;
    setSearchParams(next, { replace: true });
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      updateParam('search', value.trim());
    }, 400);
  };

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    let ignore = false;

    // Loading state follows each URL-driven fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError('');

    getServices({
      subject: subject || undefined,
      level: level || undefined,
      search: search || undefined,
    })
      .then((data) => {
        if (!ignore) setServices(data.services);
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
  }, [subject, level, search]);

  useEffect(() => {
    // Keep the input aligned when browser navigation changes the URL query.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(search);
  }, [search]);

  const hasFilters = Boolean(subject || level || search);

  const clearFilters = () => {
    clearTimeout(searchTimer.current);
    searchTimer.current = null;
    setSearchInput('');
    const clearedParams = new URLSearchParams();
    searchParamsRef.current = clearedParams;
    setSearchParams(clearedParams, { replace: true });
  };

  return (
    <div className="page container">
      <h1 className="page-title">Tutoring services</h1>
      <p className="page-subtitle">
        Browse one-on-one sessions by subject and level, then book a time that works for you.
      </p>

      <ServiceFilters
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        subject={subject}
        level={level}
        onFilterChange={updateParam}
        onClear={clearFilters}
        hasFilters={hasFilters}
      />

      {loading && <Spinner label="Loading services…" />}

      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && services.length === 0 && (
        <div className="empty-state card">
          <SearchX size={36} />
          <h2>No services match your filters</h2>
          <p className="text-muted">Try a different search or clear the filters.</p>
          <button className="btn btn-secondary" onClick={clearFilters}>Clear filters</button>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <>
          <p className="results-count">
            {services.length} {services.length === 1 ? 'service' : 'services'} found
          </p>
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
