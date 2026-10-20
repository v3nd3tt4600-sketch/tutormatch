import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner" role="status">
      <Loader2 className="spinner-icon" size={28} />
      <span>{label}</span>
    </div>
  );
}
