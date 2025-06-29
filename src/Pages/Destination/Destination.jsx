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
      alert("Please fill in at least a destination or a date.");
    }
  };

  return (
    <>
    <div className="intro-message">
      <span className="welcome-word">Welcome!</span>
      <span className="dream-text">Your dream destination awaits.</span>
    </div>

    <div className="destination-container">
      <h1>Plan Your Trip</h1>
      
      <form className="destination-form" onSubmit={handleSubmit}>
        <label>
          Current Location:
          <input
            type="text"
            placeholder="Your current location"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
          />
        </label>

        <label>
          Desired Destination:
          <input
            type="text"
            placeholder="Your destination"
            value={desiredDestination}
            onChange={(e) => setDesiredDestination(e.target.value)}
          />
        </label>

        <label>
          Travel Date:
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
        </label>

        <label>
          Maximum Price:
          <input
            type="number"
            placeholder="Max price in €"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </label>

        <button type="submit">Search</button>
      </form>
    </div>
     </>
  );
}

export default Destination;

