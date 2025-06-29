import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import './AdminNotificationEdit.css';

export default function AdminNotificationEdit() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/admin/notification/${id}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Notification non trouvée");
        return res.json();
      })
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) {
      alert("Message obligatoire");
      return;
    }

    fetch(`http://localhost:8080/admin/notification/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur mise à jour");
        return res.json();
      })
      .then(() => {
        alert("Notification modifiée !");
        navigate("/admin/dashboard/notification");
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="admin-notification-edit-container">
      <h3>Modifier la notification</h3>
      <form onSubmit={handleSubmit}>
        <label>Message :</label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <br />
        <button type="submit">Enregistrer</button>
        <button type="button" onClick={() => navigate("/admin/notification")}>
          Annuler
        </button>
      </form>
    </div>
  );
}
