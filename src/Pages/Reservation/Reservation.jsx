import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import './Reservation.css';

export default function Reservation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [cni, setCni] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [passport, setPassport] = useState(null);
  const [method, setMethod] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!state) {
      alert("Données manquantes. Retour aux voyages.");
      navigate("/details");
    }
  }, [state, navigate]);

  const handleSubmit = async () => {
    if (!cni || !photo || !passport ) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append("voyageId", state.voyageId);
    formData.append("hotelId", state.hotelId);
    formData.append("transportId", state.transportId);
    formData.append("activities", JSON.stringify(state.activities));
    formData.append("price", state.price);
    formData.append("cni", cni);
    formData.append("photo", photo);
    formData.append("passport", passport);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/reservation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Réservation confirmée !");
        navigate("/mes-reservations");
      } else {
        setErrorMsg(data.error || "Erreur serveur.");
      }
    } catch (err) {
      setErrorMsg("Erreur de soumission. " + err.message);
    }
  };

  if (!state) return null;

  return (
    <div className="reservation">
      <h1>Réservation pour {state.voyage?.destination || "Destination inconnue"}</h1>
      <p><strong>Description :</strong> {state.voyage?.description || 'Aucune description'}</p>
      <p><strong>Départ :</strong> {state.voyage?.depart || 'N/A'}</p>
      <p><strong>Date :</strong> 
        de {state.voyage?.start_date 
              ? new Date(state.voyage.start_date).toLocaleDateString()
              : "N/A"}
        à {state.voyage?.end_date 
              ? new Date(state.voyage.end_date).toLocaleDateString()
              : "N/A"}
      </p>

      <h2>Détails sélectionnés :</h2>
      <ul>
        <li>
          <h1>Hôtel :</h1> <br/>
          <strong> Nom: </strong> {state.hotel?.hotel_name} <br/>
          <strong> Address: </strong> {state.hotel?.address} <br/>
          <strong> Date: </strong> de 
            {state.hotel?.start_date
              ? new Date(state.hotel.start_date).toLocaleDateString() 
              : "N/A"}
            à 
            {state.hotel?.end_date
              ? new Date(state.hotel.end_date).toLocaleDateString() 
              : "N/A"} <br/>
         
          <strong> Nombre de night: </strong>  {state.hotel?.nbr_night} <br/>
          <strong> Prix: </strong>  {state.hotel?.price} €
        </li>
        <li>
          <h1>Transport :</h1> <br/>
          <strong> Type: </strong>  {state.transport?.transport_type} <br/>
          <strong> Compagnie: </strong> {state.transport?.company} <br/>
          <strong> Trajet: </strong> de {state.transport?.depart_point} à {state.transport?.arrival_point} <br/>
          <strong> Date de depart: </strong> 
            {state.transport?.departure_date 
              ? new Date(state.transport.departure_date).toLocaleDateString() 
              : "N/A"} <br/>
          <strong> Heure de depart: </strong> {state.transport?.departure_time}<br/>
          <strong> Date de retour: </strong> 
            {state.transport?.return_date 
              ? new Date(state.transport.return_date).toLocaleDateString() 
              : "N/A"} <br/>
          <strong> Heure de retour : </strong>  {state.transport?.return_time}<br/>
          <strong> Durée: </strong>  {state.transport?.duration}<br/>
          <strong> Prix: </strong> {state.transport?.price} €
        </li>
        <li>
          <h1>Activités :</h1>
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
            "Aucune"
          )}
        </li>
        <li><strong>Prix total :</strong> {state.price} €</li>
      </ul>
      <h2>Documents obligatoires</h2>
      <label>
        CNI :
        <input type="file" accept=".pdf,image/*" onChange={(e) => setCni(e.target.files[0])} required />
      </label>
      <br />
      <label>
        Photo :
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} required />
      </label>
      <br />
      <label>
        Passeport :
        <input type="file" accept=".pdf,image/*" onChange={(e) => setPassport(e.target.files[0])} required />
      </label>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <br /><br />
      <button
        onClick={() => {
          if (!cni || !photo || !passport ) {
            setErrorMsg("Veuillez remplir tous les champs obligatoires.");
            return;
          }

          navigate("/paiement", {
            state: {
              ...state, 
              cni,
              photo,
              passport,
              method
            },
          });
        }}
      >
        Passer au paiement
      </button>
    </div>
  );
}





