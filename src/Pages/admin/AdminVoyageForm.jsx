import * as React from "react";
import { useNavigate } from "react-router-dom";

import './AdminVoyageForm.css';

export default function AdminVoyageForm({ mode, initialData }) {
  console.log(" Rendu de AdminVoyageForm en mode :", mode);
  const navigate = useNavigate();

  const hotelImageInputRef = React.useRef(null);
  const transportImageInputRef = React.useRef(null);
  const activityImageInputRef = React.useRef(null);
  const voyageImageInputRef = React.useRef(null);

  const [voyage, setVoyage] = React.useState({
      description: "",
      depart: "",
      destination: "",
      start_date: "",
      end_date: "",
      Hotels: [],
      Transports: [],
      Activities: [],
      image_url: "",
      imageFile: null,
      id: null,
    }
  );

  const [hotelForm, setHotelForm] = React.useState({
   hotel_name: "",
   address: "",
   start_date: "",
   end_date: "",
   price: "",
   nbr_night: "", 
   image_url: "",
   imageFile: null,
   });

   const [transportForm, setTransportForm] = React.useState({
   transport_type: "",
   company: "",
   depart_point: "",
   arrival_point: "",
   departure_date: "",
   departure_time: "",
   duration: "",
   price: "",
   return_date: "",
   return_time: "",
   image_url: "",
   imageFile: null,
    });

  const [activityForm, setActivityForm] = React.useState({});
  const [editingHotelIndex, setEditingHotelIndex] = React.useState(null);
  const [editingTransportIndex, setEditingTransportIndex] = React.useState(null);
  const [editingActivityIndex, setEditingActivityIndex] = React.useState(null);

  React.useEffect(() => {
  if (!initialData) return;

  setVoyage(prev => {
    if (prev?.id === initialData.id) return prev; 
    function formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toISOString().split("T")[0];
    }
    return {
      description: initialData.description || "",
      depart: initialData.depart || "",
      destination: initialData.destination || "",
      start_date: formatDate(initialData.start_date),
      end_date: formatDate(initialData.end_date),
      Hotels: (initialData.Hotels || []).map(h => ({
        ...h,
        image_url: h.image_url || "",
        imageFile: null,
        start_date: formatDate(h.start_date),
        end_date: formatDate(h.end_date),
      })),
      Transports: (initialData.Transports || []).map(t => ({
        ...t,
        image_url: t.image_url || "",
        imageFile: null,
      })),
      Activities: (initialData.Activities || []).map(a => ({
        ...a,
        image_url: a.image_url || "",
        imageFile: null,
      })),
      image_url: initialData.image_url || "",
      imageFile: null,
      id: initialData.id || null,
    };
  });
}, [initialData]);

  function handleChange(event, setFn) {
    const { name, value } = event.target;
    setFn(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(event, setFn, key = "imageFile", setImageUrlFn = null) {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFn(prev => ({ ...prev, [key]: file, image_url: url }));
      if (setImageUrlFn) setImageUrlFn(url);
    } else {
      setFn(prev => ({ ...prev, [key]: null, image_url: "" }));
      if (setImageUrlFn) setImageUrlFn("");
    }
  }

  function addOrUpdateItem(event, form, setForm, field, inputRef, editingIndex, setEditingIndex) {
    event.preventDefault();

    if (!Object.values(form).every(val => val !== undefined && val !== null && val !== "")) {
      alert("Veuillez remplir tous les champs du formulaire avant d'ajouter.");
      return;
    }
    setVoyage(prev => {
      const updatedItems = [...prev[field]];
      if (editingIndex !== null) {
        updatedItems[editingIndex] = form;
      } else {
        updatedItems.push(form);
      }
      return { ...prev, [field]: updatedItems };
    });
    setForm({});
    setEditingIndex(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function deleteItem(index, field) {
    setVoyage(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  function editItem(index, field, setForm, setEditingIndex) {
    setForm(voyage[field][index]);
    setEditingIndex(index);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      const { Hotels, Transports, Activities, imageFile, image_url, ...base } = voyage;

      Object.entries(base).forEach(([k, v]) => v && formData.append(k, v));
      if (imageFile) formData.append("image", imageFile);

      formData.append(
        "Hotels",
        JSON.stringify(Hotels.map(({ imageFile, image_url, ...rest }) => rest))
      );
      Hotels.forEach(h => h.imageFile && formData.append("HotelsImages", h.imageFile));

      formData.append(
        "Transports",
        JSON.stringify(Transports.map(({ imageFile, image_url, ...rest }) => rest))
      );
      Transports.forEach(t => t.imageFile && formData.append("TransportsImages", t.imageFile));

      formData.append(
        "Activities",
        JSON.stringify(Activities.map(({ imageFile, image_url, ...rest }) => rest))
      );
      Activities.forEach(a => a.imageFile && formData.append("ActivitiesImages", a.imageFile));

      const url = voyage.id
        ? `http://localhost:8080/admin/voyage/${voyage.id}`
        : `http://localhost:8080/admin/voyage`;
      const method = voyage.id ? "PUT" : "POST";

      const token = localStorage.getItem("token");
    console.log("Token récupéré :", token);

    const res = await fetch(url, {
      method,
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      if (res.ok) {
        alert(voyage.id ? "Voyage mis à jour !" : "Voyage créé !");
        navigate("/admin/dashboard/voyage/list");
      } else {
        alert("Erreur lors de la soumission.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    }
  }

return (
  <div className="admin-voyage-container">
    <h2>{mode === "edit" ? "Modifier un voyage" : "Créer un voyage"}</h2>
    <form onSubmit={handleSubmit}>
      
      <div className="form-block">
        <h3>Voyage</h3>
        <div className="form-block-grid">
          <div>
            <label htmlFor="voyageImage">Image du voyage</label>
            <input
              type="file" id="voyageImage" onChange={e => handleFileChange(e, setVoyage, "imageFile", (url) => setVoyage(prev => ({ ...prev, image_url: url })))} ref={voyageImageInputRef}
            />
            {voyage.image_url && (
              <img src={voyage.image_url} alt="preview" />
            )}
          </div>
          <div>
            <label>Description</label>
            <input
              name="description" placeholder="Description" value={voyage.description} onChange={e => handleChange(e, setVoyage)} required
            />
          </div>
          <div>
            <label>Départ</label>
            <input
              name="depart" placeholder="Départ" value={voyage.depart} onChange={e => handleChange(e, setVoyage)} required
            />
          </div>
          <div>
            <label>Destination</label>
            <input
              name="destination" placeholder="Destination" value={voyage.destination} onChange={e => handleChange(e, setVoyage)} required
            />
          </div>
          <div>
            <label>Date de début</label>
            <input
              name="start_date" type="date" value={voyage.start_date} onChange={e => handleChange(e, setVoyage)} required
            />
          </div>
          <div>
            <label>Date de fin</label>
            <input
              name="end_date" type="date" value={voyage.end_date} onChange={e => handleChange(e, setVoyage)} required
            />
          </div>
        </div>
      </div>

      <div className="form-block">
        <h3>Hôtels</h3>
        <div className="form-block-grid">
          <div>
            <label>Image Hôtel</label>
            <input
              type="file" onChange={e => handleFileChange(e, setHotelForm)} ref={hotelImageInputRef}
            />
          </div>
          <div>
            <label>Nom de l'hôtel</label>
            <input
              name="hotel_name" placeholder="Nom de l'hôtel" value={hotelForm.hotel_name || ""} onChange={e => handleChange(e, setHotelForm)} 
            />
          </div>
          <div>
            <label>Adresse</label>
            <input
              name="address" placeholder="Adresse" value={hotelForm.address || ""} onChange={e => handleChange(e, setHotelForm)} 
            />
          </div>
          <div>
            <label>Date début</label>
            <input
              name="start_date" type="date" value={hotelForm.start_date || ""} onChange={e => handleChange(e, setHotelForm)} 
            />
          </div>
          <div>
            <label>Date fin</label>
            <input
              name="end_date" type="date" value={hotelForm.end_date || ""} onChange={e => handleChange(e, setHotelForm)} 
            />
          </div>
          <div>
            <label>Prix</label>
            <input
              name="price" type="number" placeholder="Prix" value={hotelForm.price || ""} onChange={e => handleChange(e, setHotelForm)} 
            />
          </div>
          <div>
            <label>Nombre de nuits</label>
            <input
              name="nbr_night" type="number" min="1" placeholder="Nombre de nuits" value={hotelForm.nbr_night || ""} onChange={e => handleChange(e, setHotelForm)}
            />
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          {editingHotelIndex !== null ? (
            <button onClick={e => addOrUpdateItem(e, hotelForm, setHotelForm, "Hotels", hotelImageInputRef, editingHotelIndex, setEditingHotelIndex)}>
              Modifier l'hôtel
            </button>
          ) : (
            <button onClick={e => addOrUpdateItem(e, hotelForm, setHotelForm, "Hotels", hotelImageInputRef, editingHotelIndex, setEditingHotelIndex)}>
              Ajouter un hôtel
            </button>
          )}
        </div>
        {voyage.Hotels?.map((h, i) => (
          <div className="item-row" key={i}>
            {h.image_url && <img src={h.image_url} alt="hotel" width="100" />}
            <span>{h.hotel_name}</span>
            <button type="button" onClick={() => deleteItem(i, "Hotels")}>Supprimer</button>
            <button type="button" onClick={() => editItem(i, "Hotels", setHotelForm, setEditingHotelIndex)}>Modifier</button>
          </div>
        ))}
      </div>

      <div className="form-block">
        <h3>Transports</h3>
        <div className="form-block-grid">
          <div>
            <label>Image Transport</label>
            <input
              type="file" onChange={e => handleFileChange(e, setTransportForm)} ref={transportImageInputRef}
            />
          </div>
          <div>
            <label>Type</label>
            <input
              name="transport_type" placeholder="Type" value={transportForm.transport_type || ""} onChange={e => handleChange(e, setTransportForm)} 
            />
          </div>
          <div>
            <label>Compagnie</label>
            <input
              name="company" placeholder="Compagnie" value={transportForm.company || ""} onChange={e => handleChange(e, setTransportForm)} 
            />
          </div>
          <div>
            <label>Point de départ</label>
            <input
              name="depart_point" placeholder="Point de départ" value={transportForm.depart_point || ""} onChange={e => handleChange(e, setTransportForm)} 
            />
          </div>
          <div>
            <label>Point d'arrivée</label>
            <input
              name="arrival_point" placeholder="Point d'arrivée" value={transportForm.arrival_point || ""} onChange={e => handleChange(e, setTransportForm)} 
            />
          </div>
          <div>
            <label>Date de départ</label>
            <input
              name="departure_date"type="date" value={transportForm.departure_date || ""} onChange={e => handleChange(e, setTransportForm)} 
            />
          </div>
          <div>
            <label>Heure de départ</label>
            <input
              name="departure_time"type="time" value={transportForm.departure_time || ""} onChange={e => handleChange(e, setTransportForm)} 
            />
          </div>
          <div>
            <label>Durée</label>
            <input
              name="duration" placeholder="Durée" value={transportForm.duration || ""} onChange={e => handleChange(e, setTransportForm)} 
            />
          </div>
          <div>
            <label>Prix</label>
            <input
              name="price" type="number" placeholder="Prix" value={transportForm.price || ""} onChange={e => handleChange(e, setTransportForm)} 
            />
          </div>
          <div>
            <label>Date de retour</label>
            <input
              name="return_date" type="date"  value={transportForm.return_date || ""} onChange={e => handleChange(e, setTransportForm)}
            />
          </div>
          <div>
            <label>Heure de retour</label>
            <input
              name="return_time"type="time" value={transportForm.return_time || ""} onChange={e => handleChange(e, setTransportForm)} 
            />
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          {editingTransportIndex !== null ? (
            <button onClick={e => addOrUpdateItem(e, transportForm, setTransportForm, "Transports", transportImageInputRef, editingTransportIndex, setEditingTransportIndex)}>
              Modifier le transport
            </button>
          ) : (
            <button onClick={e => addOrUpdateItem(e, transportForm, setTransportForm, "Transports", transportImageInputRef, editingTransportIndex, setEditingTransportIndex)}>
              Ajouter un transport
            </button>
          )}
        </div>
        {voyage.Transports?.map((t, i) => (
          <div className="item-row" key={i}>
            {t.image_url && <img src={t.image_url} alt="transport" width="100" />}
            <span>{t.transport_type}</span>
            <button type="button" onClick={() => deleteItem(i, "Transports")}>Supprimer</button>
            <button type="button" onClick={() => editItem(i, "Transports", setTransportForm, setEditingTransportIndex)}>Modifier</button>
          </div>
        ))}
      </div>

      <div className="form-block">
        <h3>Activités</h3>
        <div className="form-block-grid">
          <div>
            <label>Image Activité</label>
            <input
              type="file" onChange={e => handleFileChange(e, setActivityForm)} ref={activityImageInputRef}
            />
          </div>
          <div>
            <label>Nom</label>
            <input
              name="activity_name" placeholder="Nom" value={activityForm.activity_name || ""} onChange={e => handleChange(e, setActivityForm)} 
            />
          </div>
          <div>
            <label>Heure</label>
            <input
              name="activity_time" type="time" value={activityForm.activity_time || ""} onChange={e => handleChange(e, setActivityForm)} 
            />
          </div>
          <div>
            <label>Date</label>
            <input
              name="date" type="date" value={activityForm.date || ""} onChange={e => handleChange(e, setActivityForm)} 
            />
          </div>
          <div>
            <label>Durée</label>
            <input
              name="duration" placeholder="Durée" value={activityForm.duration || ""} onChange={e => handleChange(e, setActivityForm)} 
            />
          </div>
          <div>
            <label>Prix</label>
            <input
              name="price" type="number" placeholder="Prix" value={activityForm.price || ""} onChange={e => handleChange(e, setActivityForm)} 
            />
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          {editingActivityIndex !== null ? (
            <button onClick={e => addOrUpdateItem(e, activityForm, setActivityForm, "Activities", activityImageInputRef, editingActivityIndex, setEditingActivityIndex)}>
              Modifier l'activité
            </button>
          ) : (
            <button onClick={e => addOrUpdateItem(e, activityForm, setActivityForm, "Activities", activityImageInputRef, editingActivityIndex, setEditingActivityIndex)}>
              Ajouter une activité
            </button>
          )}
        </div>
        {voyage.Activities?.map((a, i) => (
          <div className="item-row" key={i}>
            {a.image_url && <img src={a.image_url} alt="activity" width="100" />}
            <span>{a.activity_name}</span>
            <button type="button" onClick={() => deleteItem(i, "Activities")}>Supprimer</button>
            <button type="button" onClick={() => editItem(i, "Activities", setActivityForm, setEditingActivityIndex)}>Modifier</button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button type="submit">
          {mode === "edit" ? "Mettre à jour" : "Créer"}
        </button>
      </div>
    </form>
  </div>
);
}
