import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import './Confirmation.css';

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!state) {
    return (
      <div>
        <p>Aucune information de réservation trouvée.</p>
        <button onClick={() => navigate("/voyage")}>Retour aux voyages</button>
      </div>
    );
  }

  
const handleConfirm = async () => {
    console.log("ID réservation envoyée :", state.id);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/reservation/confirm", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ reservationId: state.id }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur inconnue");
    }

    setConfirmed(true);
  } catch (error) {
    alert("Erreur lors de la confirmation : " + error.message);
  }
};


  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    setShowCancelConfirm(false);
    setLoading(true);
    try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/reservation/confirm", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ reservationId: state.id }),
    });
    
      const data = await res.json(); 
    console.log("Réponse annulation :", data);

    if (!res.ok) throw new Error(data.error || "Erreur annulation");

      alert("Votre réservation a été annulée.");
      navigate("/destination");
    } catch (error) {
      alert("Erreur lors de l'annulation, réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const cancelCancel = () => {
    setShowCancelConfirm(false);
  };

  if (loading) {
    return <div><p>Attendez...</p></div>;
  }

  if (confirmed) {
  return (
    <div className="confirmation-success">
      <h2>Votre réservation est confirmée !</h2>
      <button onClick={() => navigate("/notification")}>Voir notifications</button>
    </div>
  );
}

  return (
    <div className="confirmation">
      <h1>Confirmation de votre réservation</h1>

      <p><strong>Description :</strong> {state.voyage?.description}</p>
      <p><strong>Depart :</strong> {state.voyage?.depart}</p>
      <p><strong>Destination :</strong> {state.voyage?.destination}</p>
      <p><strong>Date :</strong> de 
        {state.voyage?.start_date 
          ? new Date(state.voyage.start_date).toLocaleDateString() 
          : "N/A"} 
        à 
        {state.voyage?.end_date 
          ? new Date(state.voyage.end_date).toLocaleDateString() 
          : "N/A"}
      </p>

      <h3>Hôtel</h3>
      <p><strong> Nom: </strong> {state.hotel?.hotel_name}  </p>
      <p><strong> Address: </strong> {state.hotel?.address} </p>
      <p><strong> Date: </strong> de 
        {state.hotel?.start_date
          ? new Date(state.hotel.start_date).toLocaleDateString() 
          : "N/A"}
        à 
        {state.hotel?.end_date
          ? new Date(state.hotel.end_date).toLocaleDateString() 
          : "N/A"}
         </p>
      <p><strong> Nombre de night: </strong> {state.hotel?.nbr_night} </p>
      <p><strong> Prix: </strong> {state.hotel?.price} € </p> 

      <h3>Transport</h3>
      <p><strong> Type: </strong>  {state.transport?.transport_type}  </p>
      <p><strong> Compagnie: </strong>  {state.transport?.company} </p>   
      <p><strong> Trajet: </strong> de {state.transport?.depart_point} à {state.transport?.arrival_point} </p> 
      <p><strong> Date de depart: </strong> 
        {state.transport?.departure_date 
        ? new Date(state.transport.departure_date).toLocaleDateString() 
        : "N/A"}
      </p>
      <p><strong> Heure de depart: </strong> {state.transport?.departure_time} </p> 
      <p><strong> Date de retour: </strong> 
        {state.transport?.return_date 
        ? new Date(state.transport.return_date).toLocaleDateString() 
        : "N/A"}
      </p> 
      <p><strong> Heure de retour : </strong>  {state.transport?.return_time} </p> 
      <p><strong> Durée: </strong>  {state.transport?.duration}</p> 
      <p><strong> Prix: </strong>  {state.transport?.price} € </p> 

      <h3>Activités</h3>
      {state.activities?.length > 0 ? (
        <ul>
          {state.activities.map((act, index) => (
            <li key={index}>
              <strong> Nom: </strong> {act.activity_name} <br/>
              <strong> Date: </strong> {act.date
                  ? new Date(act.date).toLocaleDateString() 
                  : "N/A"} <br/>
              <strong> Heure: </strong> {act.activity_time} <br/>
              <strong> Durée: </strong>  {act.duration} <br/>
              <strong> Prix: </strong> {act.price} €
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune activité sélectionnée.</p>
      )}

      <h3>Prix total</h3>
      <p>{state.price} €</p>

      <h3>Méthode de paiement</h3>
      <p>{state.method}</p>

      {state.method === "Carte Bancaire" && (
        <div>
          <p><strong>Numéro de carte :</strong> **** **** **** {state.cardNumber?.slice(-4)}</p>
          <p><strong>Date d'expiration :</strong> {state.expiry}</p>
        </div>
      )}

      {state.method === "PayPal" && (
        <p><strong>Email PayPal :</strong> {state.paypalEmail}</p>
      )}

      {state.method === "Virement Bancaire" && (
        <div>
          <p><strong>Numéro de compte bancaire :</strong> {state.bankAccount}</p>
          <p><strong>Nom de la banque :</strong> {state.bankName}</p>
        </div>
      )}

      <button onClick={handleConfirm}>Confirmer</button>
      <button onClick={handleCancel}>Annuler</button>

      {showCancelConfirm && (
        <div className="popup">
          <p>Voulez-vous vraiment annuler votre réservation ?</p>
          <button onClick={confirmCancel}>Ok</button>
          <button onClick={cancelCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
}

