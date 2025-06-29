import React, { useEffect, useState } from "react";

import './AdminNotificationCreate.css';

export default function AdminNotificationCreate({ onNotificationCreated }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  console.log("TOKEN =", token);

  const fetchUsers = () => {
    fetch("http://localhost:8080/admin/users", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((e) => console.error("Erreur chargement utilisateurs :", e));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !message) {
      alert("Champs requis !");
      return;
    }

    fetch("http://localhost:8080/admin/notification", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, message }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur création");
        return res.json();
      })
      .then(() => {
        alert("Notification envoyée !");
        setUserId("");
        setMessage("");
        onNotificationCreated?.(); 
      })
      .catch((err) => alert(err.message));
  };

  const envoyerATous = () => {
    if (!message) {
      alert("Message requis");
      return;
    }
    if (!window.confirm("Envoyer à tous les utilisateurs ?")) return;

    fetch("http://localhost:8080/admin/notification/envoyer-tous", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur envoi à tous");
        return res.json();
      })
      .then(() => {
        alert("Notification envoyée à tous !");
        setMessage("");
        onNotificationCreated?.();
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="admin-notification-container">
      <h3>Créer une notification</h3>
      <form onSubmit={handleSubmit}>
        <label>Utilisateur :</label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">-- Sélectionner --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username || u.name} ({u.email})
            </option>
          ))}
        </select>
        <br />

        <label>Message :</label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <br />

        <button type="submit">Envoyer</button>
        <button type="button" onClick={envoyerATous}>
          Envoyer à tous
        </button>
      </form>
    </div>
  );
}




