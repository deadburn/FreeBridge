import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCities } from "../api/cityApi";
import { saveCompanyProfile } from "../api/companyApi";

const CompanyDashboard = () => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [formData, setFormData] = useState({
    nomb_emp: "",
    NIT: "",
    tamaño: "",
    desc_emp: "",
    id_ciud: "",
  });
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado y es una empresa
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "Empresa") {
      navigate("/login");
      return;
    }

    // Cargar ciudades para el selector
    const loadCities = async () => {
      try {
        const c = await getCities();
        setCities(c);
      } catch (err) {
        console.error("No se pudieron cargar las ciudades", err);
      }
    };

    loadCities();

    // TODO: Aquí agregaremos la verificación del perfil
  }, [navigate]);

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
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("No se encontró el ID del usuario");
      }

      const companyData = {
        ...formData,
        id_usu: userId,
      };

      const response = await saveCompanyProfile(companyData);
      if (response.success) {
        setProfileComplete(true);
        // Aquí podrías guardar el id_emp en localStorage si lo necesitas después
        if (response.id_emp) {
          localStorage.setItem("companyId", response.id_emp);
        }
      }
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      alert("Error al guardar el perfil de la empresa");
    }
  };

  if (!profileComplete) {
    return (
      <div className="company-profile-form">
        <h2>Complete su perfil de empresa</h2>
        <p>Para poder crear vacantes, primero debe completar su perfil</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nomb_emp">Nombre de la empresa</label>
            <input
              type="text"
              id="nomb_emp"
              name="nomb_emp"
              value={formData.nomb_emp}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="NIT">NIT</label>
            <input
              type="text"
              id="NIT"
              name="NIT"
              value={formData.NIT}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="tamaño">Tamaño de la empresa</label>
            <select
              id="tamaño"
              name="tamaño"
              value={formData.tamaño}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un tamaño</option>
              <option value="Pequeña">Pequeña</option>
              <option value="Mediana">Mediana</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
          <div>
            <label htmlFor="desc_emp">Descripción de la empresa</label>
            <textarea
              id="desc_emp"
              name="desc_emp"
              value={formData.desc_emp}
              onChange={handleInputChange}
              required
              maxLength={250}
            />
          </div>
          <div>
            <label htmlFor="id_ciud">Ciudad</label>
            <select
              id="id_ciud"
              name="id_ciud"
              value={formData.id_ciud}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione una ciudad</option>
              {cities.map((c) => (
                <option key={c.id_ciud} value={c.id_ciud}>
                  {c.nomb_ciud}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Guardar Perfil</button>
        </form>
      </div>
    );
  }

  return (
    <div className="company-dashboard">
      <h1>Panel de Empresa</h1>
      {/* Aquí irá el contenido del dashboard una vez el perfil esté completo */}
    </div>
  );
};

export default CompanyDashboard;
