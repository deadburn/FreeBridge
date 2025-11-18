import axiosInstance from "./axiosConfig";

export const saveCompanyProfile = async (companyData) => {
  try {
    const response = await axiosInstance.post(
      "/api/empresa/perfil",
      companyData
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error || "Error al guardar el perfil de la empresa"
      );
    }
    throw error;
  }
};

export const getCompanyProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/empresa/perfil/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error || "Error al obtener el perfil de la empresa"
      );
    }
    throw error;
  }
};

export const updateCompanyProfile = async (companyId, companyData) => {
  try {
    // Configurar headers para multipart/form-data si es FormData
    const config =
      companyData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

    const response = await axiosInstance.put(
      `/api/empresa/perfil/${companyId}`,
      companyData,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error ||
          "Error al actualizar el perfil de la empresa"
      );
    }
    throw error;
  }
};
