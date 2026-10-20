import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page container" style={{ textAlign: 'center' }}>
      <h1 className="page-title">Page not found</h1>
      <p className="page-subtitle">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
