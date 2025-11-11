import { useState, useEffect } from "react";
import {
  getFreelancerProfile,
  saveFreelancerProfile,
} from "../api/freelancerApi";

export const useFreelancerProfile = (userId) => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    profesion: "",
    portafolio_URL: "",
    experiencia: "",
    id_ciud: "",
  });

  useEffect(() => {
    if (userId) {
      checkProfile();
    }
  }, [userId]);

  const checkProfile = async () => {
    try {
      const profileData = await getFreelancerProfile(userId);
      console.log("Respuesta del perfil:", profileData);

      if (profileData && profileData.perfilCompleto && profileData.freelancer) {
        setProfileComplete(true);
        if (profileData.freelancer.id_free) {
          localStorage.setItem("freelancerId", profileData.freelancer.id_free);
        }
      } else {
        setProfileComplete(false);
      }
    } catch (error) {
      console.log("Perfil no encontrado, debe completarlo:", error.message);
      setProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userId) {
        throw new Error("No se encontró el ID del usuario");
      }

      const freelancerData = {
        ...formData,
        id_usu: userId,
      };

      const response = await saveFreelancerProfile(freelancerData);
      if (response.success) {
        if (response.id_free) {
          localStorage.setItem("freelancerId", response.id_free);
        }
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      alert(error.message || "Error al guardar el perfil de freelancer");
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setProfileComplete(true);
  };

  return {
    profileComplete,
    loading,
    showSuccessModal,
    formData,
    handleInputChange,
    handleSubmit,
    handleSuccessModalClose,
  };
};
