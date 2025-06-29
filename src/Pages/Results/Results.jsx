import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt } from 'react-icons/fa';

import './Results.css';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state;

  const [voyages, setVoyages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const params = new URLSearchParams();

  if (searchData.desiredDestination) {
    params.append("destination", searchData.desiredDestination);
  }

  if (searchData.travelDate) {
    params.append("date", searchData.travelDate);
  }

  fetch(`http://localhost:8080/voyages/search?${params.toString()}`)
    .then(res => {
      if (!res.ok) throw new Error("Voyage introuvable");
      return res.json();
    })
    .then(data => setVoyages(data))
    .catch(err => {
      console.error(err);
      setVoyages([]);
    })
    .finally(() => setLoading(false));
}, [searchData]);

  const goBack = () => {
    navigate(-1);
  };

  const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

  return (
  <div className="results-container">
    <h1>Résultats des voyages</h1>
    <button className="back-btn" onClick={goBack}>← Retour</button>

    {loading ? (
      <p>Chargement...</p>
    ) : voyages.length > 0 ? (
      voyages.map(v => (
  <div key={v.id} className="voyage-card">
    <p><FaPlaneDeparture style={{ marginRight: '8px', color: '#00c8aa' }} />
      <strong>Départ :</strong> {v.depart || "N/A"}
    </p>

    <p><FaPlaneArrival style={{ marginRight: '8px', color: '#0077cc' }} />
      <strong>Destination :</strong> {v.destination}
    </p>

    <p><FaCalendarAlt style={{ marginRight: '8px', color: '#00c8aa' }} />
      <strong>Du :</strong> {new Date(v.start_date).toLocaleDateString()}
    </p>

    <p><FaCalendarAlt style={{ marginRight: '8px', color: '#00c8aa' }} />
      <strong>Au :</strong> {new Date(v.end_date).toLocaleDateString()}
    </p>

    <button onClick={() => {
      if (isAuthenticated()) {
        navigate(`/details/${v.id}`);
      } else {
        navigate('/login', { state: { from: `/details/${v.id}` } });
      }
    }}>
      Voir Détails
    </button>
  </div>
      ))
    ) : (
      <p>Aucun voyage trouvé.</p>
    )}
  </div>
);
}

export default Results;



