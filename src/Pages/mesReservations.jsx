import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirige vers login si pas connecté
      navigate("/login");
      return;
    }

    async function fetchReservations() {
      try {
        const res = await fetch("http://localhost:8080/myreservation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des réservations");
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchReservations();
  }, [navigate]);

  if (reservations.length === 0) return <p>Aucune réservation pour le moment.</p>;

  return (
    <div>
      <h2>Mes Réservations</h2>
      <ul>
        {reservations.map((res) => (
          <li key={res._id || res.id} style={{ marginBottom: "1.5rem" }}>
            <p><strong>Voyage :</strong> {res.voyage?.description || "Voyage inconnu"}</p>
            <p><strong>Prix total :</strong> {res.price} €</p>
            <button
              onClick={() => window.open(`http://localhost:8080/pdfs/reservation/${res._id || res.id}`, "_blank")}
              style={{ cursor: "pointer" }}
            >
              Télécharger le PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


