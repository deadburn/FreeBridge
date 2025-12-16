import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFreelancerProfile } from "../api/freelancerApi";

/**
 * Hook para obtener la profesión del freelancer logueado
 * @returns {Object} { profession: string, loading: boolean, error: string }
 */
export const useFreelancerProfession = () => {
  const [profession, setProfession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, userRole } = useAuth();

  useEffect(() => {
    const fetchProfession = async () => {
      // Solo obtener si es freelancer
      if (userRole !== "FreeLancer" || !userId) {
        setLoading(false);
        return;
      }

      try {
        console.log(
          "📋 useFreelancerProfession - Obteniendo profesión para usuario:",
          userId
        );
        const profileData = await getFreelancerProfile(userId);

        if (profileData && profileData.freelancer) {
          const prof =
            profileData.freelancer.profesion || profileData.freelancer.profesi;
          console.log("✓ Profesión obtenida:", prof);
          setProfession(prof);
        } else {
          console.log("⚠️ No hay datos de freelancer en la respuesta");
        }
      } catch (err) {
        console.error("❌ Error al obtener profesión:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfession();
  }, [userId, userRole]);

  return {
    profession,
    loading,
    error,
  };
};
