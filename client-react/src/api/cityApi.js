import axiosInstance from "./axiosConfig";

export const getCities = async () => {
  try {
    const res = await axiosInstance.get("/api/ciudades");
    // API devuelve { success: true, ciudades: [...] }
    if (res.data && res.data.ciudades) return res.data.ciudades;
    return [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

export default {
  getCities,
};
