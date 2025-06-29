import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Notification.css";

const baseUrl = "http://localhost:8080";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login'); 
      return;
    }

    async function fetchNotifications() {
      try {
        const res = await fetch("http://localhost:8080/notification", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur chargement notifications");
        const data = await res.json();
        console.log("Notifications reçues :", data);
        setNotifications(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchNotifications();
  }, [navigate]);

  if (notifications.length === 0) 
    return <p>Aucune notification pour le moment.</p>;

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif) => (
          <li key={notif.id}>
            <strong>Notification :</strong> {notif.message}{" "} 
            {notif.documentUrl && (
              <a 
                href={baseUrl + notif.documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
              Le PDF
            </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

