import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LogIn, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h1 className="logo">TypeShift</h1>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-item" title="Home">
            <Home size={20} />
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-item" title="Profile">
                <User size={20} />
              </Link>
              <button onClick={logout} className="nav-item btn-link" title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-item" title="Login">
              <LogIn size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
