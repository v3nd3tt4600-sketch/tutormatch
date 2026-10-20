import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <GraduationCap size={26} />
          <span>TutorMatch</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/advisor" onClick={closeMenu}>AI Advisor</NavLink>
          <NavLink to="/login" onClick={closeMenu}>Log in</NavLink>
          <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
