import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Logout.css'

export default function Logout({ onLogout }) {
  const navigate = useNavigate();

  const handleQuit = () => {
    navigate(-1); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    if (onLogout) onLogout();

    navigate('/login');
  };

  return (
    <div className="logout-container">
      <h2>Êtes-vous sûr de vouloir vous déconnecter de votre compte ?</h2>
      <div className="buttons">
        <button className="btn-quit" onClick={handleQuit}>Quitter</button>
        <button className="btn-logout" onClick={handleLogout}>Déconnecter</button>
      </div>
    </div>
  );
}


