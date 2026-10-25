import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getErrorMessage } from '../api/client';
import ErrorMessage from '../components/common/ErrorMessage';
import getHomePath from '../utils/getHomePath';
import usePageTitle from '../hooks/usePageTitle';
import './AuthPages.css';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function Register() {
  usePageTitle('Create an account');

  const { user, register } = useAuth();
  const location = useLocation();
  const from = location.state?.from;

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={from || getHomePath(user)} replace />;
  }

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Enter your name';
    if (!EMAIL_PATTERN.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match';
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
      await register(form.name.trim(), form.email, form.password);
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (name, label, type, autoComplete) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        className={`input ${errors[name] ? 'has-error' : ''}`}
        value={form[name]}
        onChange={handleChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors[name])}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>Create your account</h1>
        <p className="text-muted">Book tutoring sessions and get AI study recommendations.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <ErrorMessage message={serverError} />

          {renderField('name', 'Full name', 'text', 'name')}
          {renderField('email', 'Email', 'email', 'email')}
          {renderField('password', 'Password', 'password', 'new-password')}
          {renderField('confirmPassword', 'Confirm password', 'password', 'new-password')}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" state={{ from }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
