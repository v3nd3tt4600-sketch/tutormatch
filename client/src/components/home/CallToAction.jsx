import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function CallToAction() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="container home-section">
      <div className="cta-band">
        <h2>Ready to get unstuck?</h2>
        <p>Your first session is only a few clicks away.</p>
        {isLoggedIn ? (
          <Link to="/services" className="btn cta-button">
            Book a session
          </Link>
        ) : (
          <Link to="/register" className="btn cta-button">
            Create a free account
          </Link>
        )}
      </div>
    </section>
  );
}
