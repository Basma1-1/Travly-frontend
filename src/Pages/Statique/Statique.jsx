import React, { useEffect, useState } from 'react';
import './Statique.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Statique() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch("http://localhost:8080/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        console.error("Erreur lors de la récupération des stats", res.status);
        return;
      } 

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des stats", err);
      }
    }

    fetchStats();
  }, []);

  if (!stats) return <p>Chargement des statistiques...</p>;

  return (
    <div className="statistique-container">
      <h2>Statistiques Admin</h2>

      <div className="stat-cards">
        <div className="stat-card">
          <h3>Voyages</h3>
          <p>{stats.voyagesCount}</p>
        </div>
        <div className="stat-card">
          <h3>Utilisateurs</h3>
          <p>{stats.usersCount}</p>
        </div>
        <div className="stat-card">
          <h3>Réservations</h3>
          <p>{stats.reservationsCount}</p>
        </div>
      </div>

      <h3>Réservations par mois</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats.reservationsPerMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

