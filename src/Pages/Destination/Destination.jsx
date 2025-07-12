import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
import './Destination.css'

function Destination() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [desiredDestination, setDesiredDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (desiredDestination.trim() !== '' || travelDate.trim() !== '') {
      navigate('/results', {
        state: {
          currentLocation,
          desiredDestination,
          travelDate,
          maxPrice
        }
      });
    } else {
      alert("Veuillez remplir au moins une destination ou une date.");
    }
  };

  return (
    <>
    <div className="intro-message">
      <span className="welcome-word">Bienvenue!</span>
      <span className="dream-text">Votre destination de rêve vous attend.</span>
    </div>

    <div className="destination-container">
      <h1>Planifiez votre voyage</h1>
      
      <form className="destination-form" onSubmit={handleSubmit}>
        <label>
          Localisation actuelle:
          <input
            type="text"
            placeholder="Votre position actuelle"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
          />
        </label>

        <label>
          Destination souhaitée:
          <input
            type="text"
            placeholder="Votre destination"
            value={desiredDestination}
            onChange={(e) => setDesiredDestination(e.target.value)}
          />
        </label>

        <label>
          Date de voyage:
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
        </label>

        <label>
          Prix maximum:
          <input
            type="number"
            placeholder="Prix max en €"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </label>

        <button type="submit">Rechercher</button>
      </form>
    </div>
     </>
  );
}

export default Destination;

