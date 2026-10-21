import { useState } from 'react';
import Modal from '../common/Modal';
import ErrorMessage from '../common/ErrorMessage';
import { createService, updateService } from '../../api/servicesApi';
import { getErrorMessage } from '../../api/client';
import { SUBJECTS, LEVELS } from '../../utils/constants';

const EMPTY_FORM = {
  title: '',
  subject: 'Math',
  level: 'All Levels',
  tutorName: '',
  durationMinutes: 60,
  price: 40,
  description: '',
  isActive: true,
};

export default function ServiceFormModal({ service, onClose, onSaved }) {
  const isEditing = Boolean(service);
  const [form, setForm] = useState(
    isEditing
      ? {
          title: service.title,
          subject: service.subject,
          level: service.level,
          tutorName: service.tutorName,
          durationMinutes: service.durationMinutes,
          price: service.price,
          description: service.description,
          isActive: service.isActive,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setErrors((previous) => ({ ...previous, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    const duration = Number(form.durationMinutes);
    const price = Number(form.price);

    if (!form.title.trim()) newErrors.title = 'Enter a title';
    else if (form.title.trim().length > 100) newErrors.title = 'Keep the title under 100 characters';

    if (!form.tutorName.trim()) newErrors.tutorName = "Enter the tutor's name";

    if (!Number.isInteger(duration) || duration < 15 || duration > 240) {
      newErrors.durationMinutes = 'Use a whole number between 15 and 240';
    }

    if (form.price === '' || Number.isNaN(price) || price < 0) {
      newErrors.price = 'Enter a price of 0 or more';
    }

    if (!form.description.trim()) newErrors.description = 'Enter a description';
    else if (form.description.trim().length > 1000) {
      newErrors.description = 'Keep it under 1000 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...form,
      title: form.title.trim(),
      tutorName: form.tutorName.trim(),
      description: form.description.trim(),
      durationMinutes: Number(form.durationMinutes),
      price: Number(form.price),
    };

    setSubmitting(true);
    try {
      const data = isEditing
        ? await updateService(service._id, payload)
        : await createService(payload);
      onSaved(data.service, !isEditing);
    } catch (error) {
      setServerError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  const fieldError = (name) =>
    errors[name] && <span className="field-error">{errors[name]}</span>;

  return (
    <Modal title={isEditing ? 'Edit service' : 'Add a service'} onClose={onClose} wide>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <ErrorMessage message={serverError} />

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            className={`input ${errors.title ? 'has-error' : ''}`}
            value={form.title}
            onChange={handleChange}
            placeholder="Geometry Basics"
          />
          {fieldError('title')}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select id="subject" name="subject" className="input" value={form.subject} onChange={handleChange}>
              {SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="level">Level</label>
            <select id="level" name="level" className="input" value={form.level} onChange={handleChange}>
              {LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row form-row-3">
          <div className="form-group">
            <label htmlFor="tutorName">Tutor</label>
            <input
              id="tutorName"
              name="tutorName"
              className={`input ${errors.tutorName ? 'has-error' : ''}`}
              value={form.tutorName}
              onChange={handleChange}
              placeholder="Maria Lopez"
            />
            {fieldError('tutorName')}
          </div>

          <div className="form-group">
            <label htmlFor="durationMinutes">Duration (min)</label>
            <input
              id="durationMinutes"
              name="durationMinutes"
              type="number"
              min="15"
              max="240"
              step="15"
              className={`input ${errors.durationMinutes ? 'has-error' : ''}`}
              value={form.durationMinutes}
              onChange={handleChange}
            />
            {fieldError('durationMinutes')}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              className={`input ${errors.price ? 'has-error' : ''}`}
              value={form.price}
              onChange={handleChange}
            />
            {fieldError('price')}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`input ${errors.description ? 'has-error' : ''}`}
            value={form.description}
            onChange={handleChange}
            placeholder="What the session covers and who it's for. The AI Advisor reads this to make recommendations."
          />
          {fieldError('description')}
        </div>

        <label className="checkbox">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          Visible to students
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add service'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
