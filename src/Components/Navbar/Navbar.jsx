import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaBars, FaBell, FaSignOutAlt } from "react-icons/fa";

import logo from '../Assets/logo.jpg';
import './Navbar.css';

function Navbar({ darkMode, toggleMode }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const isAuthenticated = !!user;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/logout');
  };

  const handleNotifications = () => {
    navigate("/notification");
  };

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-left" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo-img" />
        <span className="brand-name">Travly</span>
      </div>

      <FaBars
        size={24}
        className="hamburger-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      />

      <ul className={`navbar-links ${menuOpen ? 'show' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/destination">Destination</Link></li>
        <li><Link to="/about">About Us</Link></li>

        <li className="spacer"></li>

        <li className="mode-toggle-right">
          <button className="mode-toggle" onClick={toggleMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <button
                onClick={handleNotifications}
                className="nav-button"
              >
                <FaBell /> Notifications
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="nav-button"
              >
                <FaSignOutAlt /> Déconnexion
              </button>
            </li>
            <li className="user-info">
              {user.name !== user.email ? user.name : user.email}
            </li>
          </>
        ) : (
          <li className="login-item">
            <Link to="/login" className="login-link">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;






