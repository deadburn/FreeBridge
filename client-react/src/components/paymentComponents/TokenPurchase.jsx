import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  getStripeConfig,
  createPaymentIntent,
  getTokenBalance,
  confirmPayment,
} from "../../api/paymentApi";
import styles from "../../styles/modules_payment/TokenPurchase.module.css";
import { MdShoppingCart, MdCheck, MdClose } from "react-icons/md";

// Componente del formulario de pago
function CheckoutForm({
  cantidadTokens,
  monto,
  paymentIntentId,
  onSuccess,
  onCancel,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/company-dashboard`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Confirmar el pago en el backend
      try {
        await confirmPayment(paymentIntent.id);
        setMessage("¡Pago exitoso! Tus tokens han sido acreditados.");
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } catch (error) {
        console.error("Error confirmando pago:", error);
        setMessage(
          "Pago exitoso pero hubo un error al acreditar tokens. Contáctanos."
        );
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.checkoutForm}>
      <div className={styles.paymentInfo}>
        <h3>Resumen de compra</h3>
        <div className={styles.summaryRow}>
          <span>Cantidad de tokens:</span>
          <strong>{cantidadTokens}</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Monto total:</span>
          <strong>${monto.toLocaleString()} COP</strong>
        </div>
        <p className={styles.infoText}>
          Cada token te permite publicar 1 vacante
        </p>
      </div>

      <div className={styles.paymentElement}>
        <PaymentElement />
      </div>

      {message && (
        <div
          className={
            message.includes("exitoso")
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {message}
        </div>
      )}

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isLoading}
        >
          <MdClose /> Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!stripe || isLoading}
        >
          {isLoading ? "Procesando..." : `Pagar $${monto.toLocaleString()} COP`}
        </button>
      </div>
    </form>
  );
}

// Componente principal
export default function TokenPurchase({ onClose, onSuccess }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [cantidadTokens, setCantidadTokens] = useState(1);
  const [monto, setMonto] = useState(0);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("select"); // select, payment

  useEffect(() => {
    loadStripeConfig();
    loadBalance();
  }, []);

  const loadStripeConfig = async () => {
    try {
      const { publishableKey } = await getStripeConfig();
      setStripePromise(loadStripe(publishableKey));
    } catch (error) {
      console.error("Error cargando configuración de Stripe:", error);
    }
  };

  const loadBalance = async () => {
    try {
      const data = await getTokenBalance();
      setBalance(data);
    } catch (error) {
      console.error("Error cargando balance:", error);
    }
  };

  const handleContinue = async () => {
    const cantidad = parseInt(cantidadTokens) || 0;
    if (cantidad < 1 || cantidad > 100) {
      alert("Cantidad de tokens inválida (1-100)");
      return;
    }

    setLoading(true);
    try {
      const data = await createPaymentIntent(cantidad);
      setClientSecret(data.clientSecret);
      // Extraer payment_intent_id del client_secret (formato: pi_xxx_secret_yyy)
      const piId = data.clientSecret.split("_secret_")[0];
      setPaymentIntentId(piId);
      setMonto(data.monto);
      setStep("payment");
    } catch (error) {
      console.error("Error creando payment intent:", error);
      alert("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  if (step === "select") {
    return (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose />
          </button>

          <div className={styles.header}>
            <MdShoppingCart className={styles.headerIcon} />
            <h2>Comprar Tokens</h2>
          </div>

          {balance && (
            <div className={styles.balanceInfo}>
              <p>
                Tokens disponibles:{" "}
                <strong>{balance.tokens_disponibles}</strong>
              </p>
              <p className={styles.subtext}>
                Tokens usados: {balance.tokens_usados}
              </p>
            </div>
          )}

          <div className={styles.selectSection}>
            <label htmlFor="cantidad">¿Cuántos tokens deseas comprar?</label>
            <input
              type="number"
              id="cantidad"
              min="1"
              max="100"
              value={cantidadTokens}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || value === "0") {
                  setCantidadTokens("");
                } else {
                  const num = parseInt(value);
                  if (!isNaN(num)) {
                    setCantidadTokens(num);
                  }
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "" || e.target.value === "0") {
                  setCantidadTokens(1);
                }
              }}
              className={styles.input}
            />

            <div className={styles.priceInfo}>
              <p>
                Precio: <strong>$12,000 COP</strong> por token
              </p>
              <p>
                Total:{" "}
                <strong>
                  ${((cantidadTokens || 0) * 12000).toLocaleString()} COP
                </strong>
              </p>
              <p className={styles.usdEquivalent}>
                ≈ ${((cantidadTokens || 0) * 3).toFixed(2)} USD
              </p>
            </div>

            <div className={styles.infoBox}>
              <MdCheck className={styles.checkIcon} />
              <div>
                <p>
                  <strong>¿Qué son los tokens?</strong>
                </p>
                <p>Cada token te permite publicar una vacante en FreeBridge.</p>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className={styles.continueButton}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Continuar al pago"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Payment
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <MdClose />
        </button>

        <div className={styles.header}>
          <h2>Pago Seguro</h2>
          <p className={styles.headerSubtext}>Procesado por Stripe</p>
        </div>

        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              cantidadTokens={cantidadTokens}
              monto={monto}
              paymentIntentId={paymentIntentId}
              onSuccess={handleSuccess}
              onCancel={() => setStep("select")}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
