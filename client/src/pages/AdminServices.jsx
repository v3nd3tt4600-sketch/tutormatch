import { useEffect, useState } from 'react';
import { Plus, Pencil, Eye, EyeOff, Trash2, Search, CheckCircle2, PackageOpen } from 'lucide-react';
import { getAllServicesAdmin, updateService, deleteService } from '../api/servicesApi';
import { getErrorMessage } from '../api/client';
import usePageTitle from '../hooks/usePageTitle';
import ServiceFormModal from '../components/admin/ServiceFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SubjectIcon from '../components/services/SubjectIcon';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatPrice, formatDuration } from '../utils/format';
import './AdminServices.css';

export default function AdminServices() {
  usePageTitle('Manage services');

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [editing, setEditing] = useState(undefined);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    getAllServicesAdmin()
      .then((data) => setServices(data.services))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => setSuccessMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const replaceService = (updated) => {
    setServices((previous) => previous.map((service) =>
      (service._id === updated._id ? updated : service)));
  };

  const handleSaved = (saved, isNew) => {
    if (isNew) {
      setServices((previous) => [...previous, saved]);
      setSuccessMessage(`"${saved.title}" was added.`);
    } else {
      replaceService(saved);
      setSuccessMessage(`"${saved.title}" was updated.`);
    }
    setEditing(undefined);
  };

  const handleToggleActive = async (service) => {
    setTogglingId(service._id);
    setActionError('');
    try {
      const data = await updateService(service._id, { isActive: !service.isActive });
      replaceService(data.service);
      setSuccessMessage(
        data.service.isActive
          ? `"${service.title}" is visible to students again.`
          : `"${service.title}" is now hidden from students.`,
      );
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteService(deleting._id);
      setServices((previous) => previous.filter((service) => service._id !== deleting._id));
      setSuccessMessage(`"${deleting.title}" was deleted.`);
      setDeleting(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeDeleteDialog = () => {
    setDeleting(null);
    setDeleteError('');
  };

  const query = search.trim().toLowerCase();
  const visibleServices = services
    .filter(
      (service) =>
        !query
        || service.title.toLowerCase().includes(query)
        || service.tutorName.toLowerCase().includes(query)
        || service.subject.toLowerCase().includes(query),
    )
    .sort((a, b) => a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title));

  const activeCount = services.filter((service) => service.isActive).length;

  return (
    <div className="page container">
      <h1 className="page-title">Manage services</h1>
      <p className="page-subtitle">Add, edit and hide the tutoring sessions students can book.</p>

      {loading && <Spinner label="Loading services…" />}
      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <div className="admin-toolbar">
            <div className="admin-search">
              <label htmlFor="admin-search" className="sr-only">Search services</label>
              <Search size={18} />
              <input
                id="admin-search"
                type="search"
                className="input"
                placeholder="Search by title, tutor or subject"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setEditing(null)}>
              <Plus size={18} /> Add service
            </button>
          </div>

          <p className="admin-summary">
            {services.length} services · {activeCount} visible · {services.length - activeCount} hidden
          </p>

          {successMessage && (
            <div className="alert alert-success dashboard-alert" role="status">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          )}
          {actionError && (
            <div className="dashboard-alert">
              <ErrorMessage message={actionError} />
            </div>
          )}

          {visibleServices.length === 0 ? (
            <div className="empty-state card">
              <PackageOpen size={36} />
              <h2>{services.length === 0 ? 'No services yet' : 'No services match your search'}</h2>
              <p>
                {services.length === 0
                  ? 'Add your first tutoring service to get started.'
                  : 'Try a different search.'}
              </p>
            </div>
          ) : (
            <div className="card admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Subject / level</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleServices.map((service) => (
                    <tr key={service._id} className={service.isActive ? '' : 'row-inactive'}>
                      <td className="no-label">
                        <div className="admin-service-cell">
                          <SubjectIcon subject={service.subject} />
                          <div>
                            <strong>{service.title}</strong>
                            <small>with {service.tutorName}</small>
                          </div>
                        </div>
                      </td>
                      <td data-label="Subject / level">{service.subject} · {service.level}</td>
                      <td data-label="Duration">{formatDuration(service.durationMinutes)}</td>
                      <td data-label="Price">{formatPrice(service.price)}</td>
                      <td data-label="Status">
                        <span className={`pill ${service.isActive ? 'pill-success' : 'pill-muted'}`}>
                          {service.isActive ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="no-label">
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-icon"
                            onClick={() => setEditing(service)}
                            aria-label={`Edit ${service.title}`}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-icon"
                            onClick={() => handleToggleActive(service)}
                            disabled={togglingId === service._id}
                            aria-label={service.isActive ? `Hide ${service.title}` : `Show ${service.title}`}
                            title={service.isActive ? 'Hide from students' : 'Show to students'}
                          >
                            {service.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-icon"
                            onClick={() => setDeleting(service)}
                            aria-label={`Delete ${service.title}`}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {editing !== undefined && (
        <ServiceFormModal
          service={editing}
          onClose={() => setEditing(undefined)}
          onSaved={handleSaved}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this service?"
          message={`"${deleting.title}" will be permanently deleted. Services that already have bookings can't be deleted; hide them instead.`}
          confirmLabel="Delete service"
          danger
          loading={deleteLoading}
          error={deleteError}
          onConfirm={handleConfirmDelete}
          onClose={closeDeleteDialog}
        />
      )}
    </div>
  );
}
