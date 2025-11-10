import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/profileApi.js";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar el contexto de autenticación
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      // Verificar autenticación usando el contexto
      if (!isAuthenticated) {
        setError("Debes iniciar sesión para ver esta página.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Error al obtener el perfil");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated]);

  if (loading) return <p>Cargando perfil...</p>;

  if (error)
    return (
      <div>
        <p>{error}</p>
        <Link to="/login">Iniciar sesión</Link>
      </div>
    );

  return (
    <div>
      <h2>Perfil de {profile.nombre}</h2>
      <p>Correo: {profile.correo}</p>
      <p>Rol: {profile.rol}</p>
      <p>Estado: {profile.estado}</p>

      {profile.freelancer && (
        <div>
          <h3>Información Freelancer</h3>
          <p>Profesión: {profile.freelancer.profesion}</p>
          <p>Portafolio: {profile.freelancer.portafolio}</p>
          <p>Experiencia: {profile.freelancer.experiencia}</p>
        </div>
      )}

      {profile.empresa && (
        <div>
          <h3>Información Empresa</h3>
          <p>Nombre: {profile.empresa.nombre}</p>
          <p>NIT: {profile.empresa.nit}</p>
          <p>Tamaño: {profile.empresa.tamaño}</p>
        </div>
      )}
    </div>
  );
}
