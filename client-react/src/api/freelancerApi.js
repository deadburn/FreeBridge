import axiosInstance from "./axiosConfig";

export const saveFreelancerProfile = async (freelancerData) => {
  try {
    const response = await axiosInstance.post(
      "/api/freelancer/perfil",
      freelancerData
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
