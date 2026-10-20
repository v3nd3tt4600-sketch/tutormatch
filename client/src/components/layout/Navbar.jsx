import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, isAdmin, loading, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    window.location.assign('/');
  };

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

          {!loading && isLoggedIn && (
            <>
              {isAdmin ? (
                <NavLink to="/admin/services" onClick={closeMenu}>Manage services</NavLink>
              ) : (
                <NavLink to="/dashboard" onClick={closeMenu}>My dashboard</NavLink>
              )}
              <span className="navbar-user">
                <User size={16} />
                {user.name.split(' ')[0]}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                <LogOut size={16} />
                Log out
              </button>
            </>
          )}

          {!loading && !isLoggedIn && (
            <>
              <NavLink to="/login" onClick={closeMenu}>Log in</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
