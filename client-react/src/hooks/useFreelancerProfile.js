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
    hoja_vida: null,
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
    const { name, type, files, value } = e.target;

    if (type === "file") {
      const file = files[0];

      // Validar que sea PDF
      if (file && file.type !== "application/pdf") {
        alert("Por favor, seleccione un archivo PDF");
        e.target.value = "";
        return;
      }

      // Validar tamaño (5MB)
      if (file && file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar los 5MB");
        e.target.value = "";
        return;
      }

      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userId) {
        throw new Error("No se encontró el ID del usuario");
      }

      // Crear FormData para enviar archivo
      const formDataToSend = new FormData();
      formDataToSend.append("profesion", formData.profesion);
      formDataToSend.append("experiencia", formData.experiencia);
      formDataToSend.append("id_ciud", formData.id_ciud);
      formDataToSend.append("id_usu", userId);

      // Agregar archivo PDF si existe
      if (formData.hoja_vida) {
        formDataToSend.append("hoja_vida", formData.hoja_vida);
      }

      const response = await saveFreelancerProfile(formDataToSend);
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
