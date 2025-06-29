import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaiementForm from "./PaiementForm";

import './Paiement.css';

export default function Paiement() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  console.log("Recieved Reservation object", state);

  if (!state) return <p>Aucune donnée reçue.</p>;

  const handlePaiement = async (paymentInfo) => {
    const formData = new FormData();
    formData.append("voyageId", state.voyage.id);
    formData.append("hotelId", state.hotel.id);
    formData.append("transportId", state.transport.id);
    formData.append("activities", JSON.stringify(state.activities));
    formData.append("price", state.price);
    formData.append("method", paymentInfo.method);

    console.log("POST BODY:", formData.values())

    if (state.cni) {
      formData.append("cni", state.cni);
      formData.append("cniFormat", state.cni.type);
      formData.append("cniTaille", state.cni.size);
    }
    if (state.photo) {
      formData.append("photo", state.photo);
      formData.append("photoFormat", state.photo.type);
      formData.append("photoTaille", state.photo.size);
    }
    if (state.passport) {
      formData.append("passport", state.passport);
      formData.append("passportFormat", state.passport.type);
      formData.append("passportTaille", state.passport.size);
    }

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
      console.log("Réponse serveur réservation:", data);

      if (response.ok) {
        const reservationId = data.reservation?.id; 
        if (!reservationId) {
          setErrorMsg("Erreur : ID de réservation manquant.");
          return;
        }

        console.log("Données envoyées à Confirmation :", { ...state, ...paymentInfo, id: reservationId });
        navigate("/confirmation", { state: { ...state, ...paymentInfo, id: reservationId } });
      } else {
        setErrorMsg(data.error || "Erreur serveur.");
      }
    } catch (err) {
      setErrorMsg("Erreur de paiement : " + err.message);
    }
};

  return (
    <div className="paiement">
      <h1>Paiement pour {state.destination}</h1>
      <p><strong>Montant :</strong> {state.price} €</p>

      {errorMsg && <p>{errorMsg}</p>}

      <PaiementForm onConfirm={handlePaiement} />
    </div>
  );
}

