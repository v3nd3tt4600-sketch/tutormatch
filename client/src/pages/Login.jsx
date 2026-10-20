import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getErrorMessage } from '../api/client';
import ErrorMessage from '../components/common/ErrorMessage';
import getHomePath from '../utils/getHomePath';
import './AuthPages.css';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={from || getHomePath(user)} replace />;
  }

  const validate = () => {
    const newErrors = {};
    if (!EMAIL_PATTERN.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.password) newErrors.password = 'Enter your password';
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(form.email, form.password);
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>Welcome back</h1>
        <p className="text-muted">Log in to book and manage your sessions.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <ErrorMessage message={serverError} />

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`input ${errors.email ? 'has-error' : ''}`}
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`input ${errors.password ? 'has-error' : ''}`}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          New to TutorMatch? <Link to="/register" state={{ from }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
