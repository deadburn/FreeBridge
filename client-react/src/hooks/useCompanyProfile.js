import { useState, useEffect } from "react";
import { getCompanyProfile, saveCompanyProfile } from "../api/companyApi";

export const useCompanyProfile = (userId) => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    NIT: "",
    tamaño: "",
    desc_emp: "",
    id_ciud: "",
  });

  useEffect(() => {
    if (userId) {
      checkProfile();
    }
  }, [userId]);

  const checkProfile = async () => {
    try {
      const profileData = await getCompanyProfile(userId);

      if (profileData && profileData.perfilCompleto && profileData.empresa) {
        setProfileComplete(true);
        if (profileData.empresa.id_emp) {
          localStorage.setItem("companyId", profileData.empresa.id_emp);
        }
      } else {
        setProfileComplete(false);
      }
    } catch (error) {
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

      const companyData = {
        ...formData,
        id_usu: userId,
      };

      const response = await saveCompanyProfile(companyData);
      if (response.success) {
        if (response.id_emp) {
          localStorage.setItem("companyId", response.id_emp);
        }
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      alert(error.message || "Error al guardar el perfil de la empresa");
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
