import Modal from './Modal';
import ErrorMessage from './ErrorMessage';

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
  error = '',
  onConfirm,
  onClose,
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-muted">{message}</p>
      <ErrorMessage message={error} />

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
          Keep it
        </button>
        <button
          type="button"
          className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
