import api from "./axiosConfig.js";

/**
 * Obtener la clave pública de Stripe
 */
export const getStripeConfig = async () => {
  const res = await api.get("/api/payment/config");
  return res.data;
};

/**
 * Obtener el balance actual de tokens de la empresa
 */
export const getTokenBalance = async () => {
  const res = await api.get("/api/payment/token-balance");
  return res.data;
};

/**
 * Crear un Payment Intent para comprar tokens
 * @param {number} cantidadTokens - Cantidad de tokens a comprar
 */
export const createPaymentIntent = async (cantidadTokens) => {
  const res = await api.post("/api/payment/create-payment-intent", {
    cantidad_tokens: cantidadTokens,
  });
  return res.data;
};

/**
 * Obtener historial de transacciones
 */
export const getTransactionHistory = async () => {
  const res = await api.get("/api/payment/transaction-history");
  return res.data;
};

/**
 * Confirmar pago manualmente (para desarrollo sin webhook)
 * @param {string} paymentIntentId - ID del payment intent de Stripe
 */
export const confirmPayment = async (paymentIntentId) => {
  const res = await api.post(`/api/payment/confirm-payment/${paymentIntentId}`);
  return res.data;
};
