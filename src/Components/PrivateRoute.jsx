import React from 'react';
import { Navigate } from 'react-router-dom';

function isTokenValid(token) {
  if (!token || token === 'null' || token === 'undefined') return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!isTokenValid(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;






