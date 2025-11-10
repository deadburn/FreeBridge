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
