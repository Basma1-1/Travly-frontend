import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password)

    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data)

      if (res.ok) {
        alert('Connexion réussie');

        localStorage.setItem('token', data.token);

        const payload = JSON.parse(atob(data.token.split('.')[1]));

        localStorage.setItem('user', JSON.stringify({
          email: email,
          name: payload.name || email,
          role: payload.role
        }));

        if (payload.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        alert(data.message || 'Erreur lors de la connexion');
      }
    } catch (err) {
      alert('Erreur serveur');
    }
  };

  return (
    <>
    <div className="login-container">
      <h2>Connexion</h2>

      {location.state?.from && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          Vous devez être connecté pour accéder à cette page.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required
          />
        </div>

        <button type="submit" className="login-btn">Se connecter</button>
      </form>

      <p className="register-link">
        Vous n'avez pas de compte ?  <Link to="/register">Inscrivez-vous</Link>
      </p>
    </div>
    </>
  );
}

export default Login;


