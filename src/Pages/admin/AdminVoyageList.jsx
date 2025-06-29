import * as React from "react";
import { useNavigate } from "react-router-dom";

import "./AdminVoyageList.css";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.split('T')[0];
}

export default function AdminVoyageList() {
  const [voyages, setVoyages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  async function fetchVoyages() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/admin/voyage");
      const body = await response.json();

      if (Array.isArray(body)) {
        setVoyages(body);
      } else if (Array.isArray(body.voyages)) {
        setVoyages(body.voyages);
      } else {
        setVoyages([]);
        console.error("Format inattendu:", body);
      }
    } catch (error) {
      console.error("Erreur chargement voyages:", error);
      setVoyages([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchVoyages();
  }, []);

  function goToEditPage(voyage) {
    if (!voyage || !voyage.id) return;
    navigate(`/admin/dashboard/voyage/edit/${voyage.id}`, { state: { voyage } });
  }

  async function handleDelete(id) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce voyage ?")) return;

    try {
      const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:8080/admin/voyage/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

    if (response.ok) {
      alert("Voyage supprimé !");
      fetchVoyages();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur réseau !");
    }
  }

  if (loading) return <p>Chargement des voyages...</p>;

  return (
    <div className="voyage-list-container">
      <h2>Liste des voyages</h2>
      <button onClick={() => navigate("/admin/dashboard/voyage/create")}>
        Créer un nouveau voyage
      </button>
      {voyages.length === 0 ? (
        <p>Aucun voyage trouvé.</p>
      ) : (
        <div>
          {voyages.map(voyage => (
            <div className="voyage-card" key={voyage.id}>
              <div>
                <strong>Description :</strong> {voyage.description}
              </div>
              <div>
                <strong>Départ :</strong> {voyage.depart}
              </div>
              <div>
                <strong>Destination :</strong> {voyage.destination}
              </div>
              <div>
                <strong>Date début :</strong> {formatDate(voyage.start_date)}
              </div>
              <div>
                <strong>Date fin :</strong> {formatDate(voyage.end_date)}
              </div>

              {voyage.image_url && (
                <img src={voyage.image_url} alt="Voyage" className="voyage-image" />
              )}

              <div className="section-block">
                <strong>Hôtels :</strong>
                {voyage.Hotels?.length > 0 ? (
                  <ul className="section-list">
                    {voyage.Hotels.map((h, i) => (
                      <li key={h.id || h.hotel_name}>
                        {h.image_url && <img src={h.image_url} alt={h.hotel_name} />}
                        <div>
                          <strong>Nom: </strong> {h.hotel_name} <br />
                          <strong>Adresse: </strong> {h.address} <br />
                          <strong>Date: </strong> de {formatDate(h.start_date)} à {formatDate(h.end_date)} <br />
                          <strong>Nombre de nuit: </strong> {h.nbr_night} nuit <br />
                          <strong>Prix: </strong> {h.price}€ 
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun hôtel</p>
                )}
              </div>

              <div className="section-block">
                <strong>Transports :</strong>
                {voyage.Transports?.length > 0 ? (
                  <ul className="section-list">
                    {voyage.Transports.map((t, i) => (
                      <li key={i}>
                        {t.image_url && <img src={t.image_url} alt={t.transport_type} />}
                        <div>
                          <strong>Type: </strong> {t.transport_type} <br />
                          <strong>Compagnie: </strong> {t.company} <br />
                          <strong>Traget: </strong> de {t.depart_point} à {t.arrival_point}  <br />
                          <strong>Date de départ : </strong>{formatDate(t.departure_date)}<br />
                          <strong>Heure de départ : </strong> {t.departure_time}  <br />
                          <strong>Durée: </strong> {t.duration} <br />
                          <strong>Date de retour : </strong>{formatDate(t.return_date)} <br />
                          <strong>Heure de retour: </strong> {t.return_time} <br />
                          <strong>Prix: </strong> {t.price}€
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun transport</p>
                )}
              </div>

              <div className="section-block">
                <strong>Activités :</strong>
                {voyage.Activities?.length > 0 ? (
                  <ul className="section-list">
                    {voyage.Activities.map((a, i) => (
                      <li key={i}>
                        {a.image_url && <img src={a.image_url} alt={a.activity_name} />}
                        <div>
                          <strong>Nom: </strong> {a.activity_name} <br />
                          <strong>Date: </strong> {formatDate(a.date)} <br />
                          <strong>Heure: </strong> {a.activity_time} <br />
                          <strong>Durée: </strong> {a.duration} <br />
                          <strong>Prix: </strong> {a.price}€
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucune activité</p>
                )}
                
              </div>
              <div className="button-group">
                <button onClick={() => goToEditPage(voyage)}>Modifier</button>
                <button onClick={() => handleDelete(voyage.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



