import { Link } from 'react-router-dom';
import { Sparkles, CalendarCheck, RefreshCcw } from 'lucide-react';
import AdvisorTeaser from './AdvisorTeaser';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="pill hero-pill">
            <Sparkles size={14} /> AI-powered tutoring
          </span>
          <h1>
            Find the right tutor, <span className="hero-highlight">fast</span>
          </h1>
          <p className="hero-subtitle">
            Tell our AI Study Advisor what you're stuck on, or browse one-on-one sessions in math,
            science, writing, coding and more. Then book a time in a few clicks.
          </p>

          <div className="hero-actions">
            <Link to="/services" className="btn btn-primary">
              Browse services
            </Link>
            <Link to="/advisor" className="btn btn-secondary">
              <Sparkles size={18} /> Ask the AI Advisor
            </Link>
          </div>

          <ul className="hero-points">
            <li>
              <CalendarCheck size={16} /> Live availability
            </li>
            <li>
              <RefreshCcw size={16} /> Reschedule or cancel before your session
            </li>
          </ul>
        </div>

        <AdvisorTeaser />
      </div>
    </section>
  );
}
