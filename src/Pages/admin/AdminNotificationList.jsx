import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import './AdminNotificationList.css';

export default function AdminNotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchNotifications = () => {
    setLoading(true);
    fetch("http://localhost:8080/admin/notification", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement");
        return res.json();
      })
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const deleteNotification = (id) => {
    if (!window.confirm("Supprimer cette notification ?")) return;
    fetch(`http://localhost:8080/admin/notification/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur suppression");
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      })
      .catch((e) => alert(e.message));
  };

  return (
    <div className="admin-notification-list-container">
      <h3>Liste des Notifications</h3>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur : {error}</p>}
      {!loading && notifications.length === 0 && <p>Aucune notification.</p>}

      {!loading && notifications.length > 0 && (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notif) => (
              <tr key={notif.id}>
                <td>{notif.User?.name || "Inconnu"}</td>
                <td>{notif.message}</td>
                <td>{new Date(notif.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => navigate(`/admin/dashboard/notification/edit/${notif.id}`)}>Modifier</button>
                  {" "}
                  <button onClick={() => deleteNotification(notif.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

