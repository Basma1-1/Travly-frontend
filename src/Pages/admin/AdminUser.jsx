import React, { useEffect, useState } from "react";

import './AdminUser.css';

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", role: "user" });
  const token = localStorage.getItem("token");

  const fetchUsers = () => {
    fetch("http://localhost:8080/admin/user", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        console.log("Réponse fetch:", res); 
        if (!res.ok) throw new Error("Erreur chargement utilisateurs");
        return res.json();
      })
      .then(setUsers)
      .catch((err) => alert(err.message));
  };

    useEffect(() => {
      fetchUsers();
    }, []);


  const handleDelete = (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    fetch(`http://localhost:8080/admin/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur suppression");
        setUsers(users.filter((u) => u.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/admin/user/${editingUser.id}`,{
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur mise à jour");
        return res.json();
      })
      .then((updated) => {
        alert("Utilisateur mis à jour !");
        setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
        setEditingUser(null);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="admin-user-container">
      <h2>Gestion des Utilisateurs</h2>

      {editingUser && (
        <form onSubmit={handleEditSubmit} style={{ marginBottom: "2rem" }}>
          <h3>Modifier l'utilisateur</h3>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <br />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
          <br />
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setEditingUser(null)} style={{ marginLeft: "1rem" }}>
            Annuler
          </button>
        </form>
      )}

      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => startEdit(u)}>Modifier</button>
                <button onClick={() => handleDelete(u.id)} style={{ marginLeft: "1rem" }}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

