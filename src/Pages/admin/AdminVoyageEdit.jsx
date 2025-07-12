import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import AdminVoyageForm from "./AdminVoyageForm";

export default function AdminVoyageEdit() {
  const { id } = useParams();
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchVoyage() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/admin/voyage/${id}`, {
          headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        
        if (!res.ok) throw new Error("Erreur fetch voyage");
        const data = await res.json();
        setVoyage(data);
      } catch (error) {
        console.error(error);
        setVoyage(null);
      } finally {
        setLoading(false);
      }
    }
    fetchVoyage();
  }, [id]);

  const memoizedInitialData = useMemo(() => voyage, [voyage]);

  if (loading) return <p>Chargement du voyage...</p>;
  if (!voyage) return <p>Voyage non trouvé.</p>;

  return <AdminVoyageForm mode="edit" initialData={memoizedInitialData} />;
}








