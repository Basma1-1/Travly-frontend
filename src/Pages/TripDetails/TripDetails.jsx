import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHotel, FaBusAlt, FaRunning, FaMapMarkedAlt } from 'react-icons/fa';

import './TripDetails.css';

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/voyages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          alert("Session expirée, veuillez vous reconnecter.");
          navigate('/login', { state: { from: `/details/${id}` } });
          return null;
        }
        if (!res.ok) throw new Error('Erreur lors de la récupération du voyage');
        return res.json();
      })
      .then(data => {
        if (data) {
          setTrip(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, navigate, token]);

  const toggleActivity = activityId => {
    setSelectedActivities(prev =>
      prev.includes(activityId) ? prev.filter(id => id !== activityId) : [...prev, activityId]
    );
  };

  const totalPrice = () => {
    if (!trip) return 0;
    let total = 0;
    if (selectedHotel) {
      const hotel = trip.Hotels.find(h => h.id === selectedHotel);
      if (hotel) total += hotel.price;
    }
    if (selectedTransport) {
      const transport = trip.Transports.find(t => t.id === selectedTransport);
      if (transport) total += transport.price;
    }
    selectedActivities.forEach(id => {
      const act = trip.Activities.find(a => a.id === id);
      if (act) total += act.price;
    });
    return total;
  };

  const handleReservation = () => {
    if (!selectedHotel || !selectedTransport) {
    alert("Veuillez sélectionner un hôtel et un transport avant de continuer.");
    return;
  }

  const selectedHotelObj = trip.Hotels.find(h => h.id === selectedHotel);
  const selectedTransportObj = trip.Transports.find(t => t.id === selectedTransport);
  const selectedActivitiesObjs = trip.Activities.filter(a => selectedActivities.includes(a.id));

  navigate("/reservation", {
    state: {
      //voyageId: trip.id,
      //description: trip.description, 
      //depart: trip.depart,
      //destination: trip.destination,
      //date: trip.start_date,
      price: totalPrice(),
      voyage: trip,
      hotel: selectedHotelObj,
      transport: selectedTransportObj,
      activities: selectedActivitiesObjs,
    },
  });
};

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!trip) return <p>Aucun voyage trouvé.</p>;

  return (
    <div className="trip-details-container">
      <h1><FaMapMarkedAlt /> Détails du Voyage vers {trip.destination}</h1>
      {trip.image_url && (
      <img
        src={`http://localhost:8080${trip.image_url}`}
        alt={trip.description}
        className="voyage-image"
      />
    )}
      <p><strong>Description :</strong> {trip.description || 'Aucune description'}</p>
      <p><strong>Départ :</strong> {trip.depart || 'N/A'}</p>
      <p><strong>Dates :</strong> de  {new Date(trip.start_date).toLocaleDateString()} à {new Date(trip.end_date).toLocaleDateString()}</p>

      {trip.Hotels?.length > 0 && (
        <>
          <h2><FaHotel /> Choisir un hôtel</h2>
          <div className="trip-options">
            {trip.Hotels.map(hotel => (
              <label key={hotel.id} className={selectedHotel === hotel.id ? 'selected' : ''}>
                <input
                  type="radio"
                  name="hotel"
                  value={hotel.id}
                  checked={selectedHotel === hotel.id}
                  onChange={() => setSelectedHotel(hotel.id)}
                />
                {hotel.image_url && (
                <img
                  src={`http://localhost:8080${hotel.image_url}`}
                  alt={hotel.hotel_name}
                  className="hotel-image"
                />
              )}
              <br/>
                <strong> Nom: {hotel.hotel_name}</strong> <br/>
                Address: {hotel.address} <br/>
                Date: de {hotel.start_date} à {hotel.end_date} <br/>
                Nombre de night: {hotel.nbr_night} <br/>
                Prix: {hotel.price}€ 
              </label>
            ))}
          </div>
        </>
      )}

      {trip.Transports?.length > 0 && (
        <>
          <h2><FaBusAlt /> Choisir un transport</h2>
          <div className="trip-options">
            {trip.Transports.map(transport => (
              <label key={transport.id} className={selectedTransport === transport.id ? 'selected' : ''}>
                <input
                  type="radio"
                  name="transport"
                  value={transport.id}
                  checked={selectedTransport === transport.id}
                  onChange={() => setSelectedTransport(transport.id)}
                />
                {transport.image_url && (
                <img
                  src={`http://localhost:8080${transport.image_url}`}
                  alt={transport.transport_type}
                  className="transport-image"
                />
              )}
              <br/>
                <strong> Type:{transport.transport_type}</strong> <br/>
                Compagnie:{transport.company}<br/>
                Trajet: de {transport.depart_point} à {transport.arrival_point} <br/>
                Date de depart: {transport.departure_date}<br/>
                Heure de depart: {transport.departure_time}<br/>
                Date de retour: {transport.return_date}<br/>
                Heure de retour : {transport.return_time}<br/>
                Durée: {transport.duration}<br/>
                Price: {transport.price}€
              </label>
            ))}
          </div>
        </>
      )}

      {trip.Activities?.length > 0 && (
        <>
          <h2><FaRunning /> Choisir des activités ({selectedActivities.length} sélectionnées)</h2>
          <div className="trip-options">
            {trip.Activities.map(activity => (
              <label key={activity.id} className={selectedActivities.includes(activity.id) ? 'selected' : ''}>
                <input
                  type="checkbox"
                  value={activity.id}
                  checked={selectedActivities.includes(activity.id)}
                  onChange={() => toggleActivity(activity.id)}
                />
                 {activity.image_url && (
                <img
                  src={`http://localhost:8080${activity.image_url}`}
                  alt={activity.activity_name}
                  className="activity-image"
                />
              )}
              <br/>
                <strong> Nom:{activity.activity_name}</strong> <br/>
                 Date:{activity.date} <br/> 
                 Heure: {activity.activity_time} <br/>
                 Durée: {activity.duration} <br/>
                 Prix:{activity.price}€
              </label>
            ))}
          </div>
        </>
      )}

      <p><strong>Prix total sélectionné :</strong> {totalPrice()} €</p>

      <button onClick={handleReservation}>Réserver le voyage</button>
      <button onClick={() => navigate(-1)}>Retour</button>
    </div>
  );
}

export default TripDetails;




