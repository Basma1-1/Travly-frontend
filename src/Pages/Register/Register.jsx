import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        navigate('/login'); 
      } else {
        alert(data.error || 'Erreur lors de l’inscription');
      }
    } catch (err) {
      alert('Erreur serveur');
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Username</label>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required
          />
        </div>

        <label>Email</label>
        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required
          />
        </div>

        <label>Password</label>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password" placeholder="Enter password" value={password}  onChange={(e) => setPassword(e.target.value)}  required
          />
        </div>

        <label>Confirm Password</label>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)}  required
          />
        </div>

        <button type="submit" className="register-btn">Register</button>

        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>

      <div className="welcome-container">
        <img src="/images/illustration.svg" alt="Welcome" className="welcome-image" />
        <h3>Welcome to Travly!</h3>
        <p>Join us and start your adventure today.</p>
      </div>
    </div>
  );
}

export default Register;


