import axiosInstance from "./axiosConfig";

export const saveFreelancerProfile = async (freelancerData) => {
  try {
    // Configurar headers para multipart/form-data si es FormData
    const config =
      freelancerData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

    const response = await axiosInstance.post(
      "/api/freelancer/perfil",
      freelancerData,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error || "Error al guardar el perfil de freelancer"
      );
    }
    throw error;
  }
};

export const getFreelancerProfile = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/api/freelancer/perfil/${userId}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error || "Error al obtener el perfil de freelancer"
      );
    }
    throw error;
  }
};

export const updateFreelancerProfile = async (freelancerId, freelancerData) => {
  try {
    // Configurar headers para multipart/form-data si es FormData
    const config =
      freelancerData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

    const response = await axiosInstance.put(
      `/api/freelancer/perfil/${freelancerId}`,
      freelancerData,
      config
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error ||
          "Error al actualizar el perfil de freelancer"
      );
    }
    throw error;
  }
};
