import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading…' }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="spinner" role="status">
      <Loader2 className="spinner-icon" size={28} />
      <span>{label}</span>
      {slow && (
        <span className="spinner-slow">
          Still working. If the app hasn't been used for a while, the server can take up to a
          minute to wake up.
        </span>
      )}
    </div>
  );
}
