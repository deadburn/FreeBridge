import React from "react";
import { useState, useEffect } from "react";
import { getTransactionHistory } from "../../api/paymentApi";
import styles from "../../styles/modules_payment/TransactionHistory.module.css";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactionHistory();
      // Asegurarse de que data sea un array
      if (Array.isArray(data)) {
        setTransactions(data);
      } else if (data && Array.isArray(data.transacciones)) {
        setTransactions(data.transacciones);
      } else {
        console.warn("Formato inesperado de respuesta:", data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error al obtener historial:", error);
      setError("No se pudo cargar el historial de transacciones");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = (tipo) => {
    switch (tipo) {
      case "compra":
        return "💳";
      case "uso":
        return "📝";
      case "reembolso":
        return "↩️";
      case "inicial":
        return "🎁";
      default:
        return "📊";
    }
  };

  const getTransactionLabel = (tipo) => {
    switch (tipo) {
      case "compra":
        return "Compra de tokens";
      case "uso":
        return "Publicación de vacante";
      case "reembolso":
        return "Reembolso";
      case "inicial":
        return "Tokens de bienvenida";
      default:
        return "Transacción";
    }
  };

  const getTransactionClass = (tipo) => {
    switch (tipo) {
      case "compra":
      case "inicial":
      case "reembolso":
        return styles.transactionPositive;
      case "uso":
        return styles.transactionNegative;
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>📊</div>
        <h2 className={styles.title}>Historial de Transacciones</h2>
      </div>

      {transactions.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📭</span>
          <p>No hay transacciones registradas</p>
          <span className={styles.emptySubtext}>
            Aquí aparecerán tus compras y uso de tokens
          </span>
        </div>
      ) : (
        <div className={styles.transactionList}>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`${styles.transactionCard} ${getTransactionClass(
                transaction.tipo
              )}`}
            >
              <div className={styles.transactionIcon}>
                {getTransactionIcon(transaction.tipo)}
              </div>

              <div className={styles.transactionInfo}>
                <div className={styles.transactionHeader}>
                  <span className={styles.transactionType}>
                    {getTransactionLabel(transaction.tipo)}
                  </span>
                  <span className={styles.transactionTokens}>
                    {transaction.tipo === "uso" ? "-" : "+"}
                    {transaction.cantidad_tokens} token
                    {transaction.cantidad_tokens !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className={styles.transactionDetails}>
                  <span className={styles.transactionDate}>
                    {formatDate(transaction.fecha)}
                  </span>
                  {transaction.monto_cop && transaction.monto_cop > 0 && (
                    <span className={styles.transactionAmount}>
                      {formatAmount(transaction.monto_cop)}
                    </span>
                  )}
                </div>

                {transaction.descripcion && (
                  <p className={styles.transactionDescription}>
                    {transaction.descripcion}
                  </p>
                )}

                <div className={styles.transactionFooter}>
                  <span className={styles.transactionStatus}>
                    Estado: <strong>{transaction.estado}</strong>
                  </span>
                  {transaction.stripe_payment_intent_id && (
                    <span className={styles.transactionId}>
                      ID:{" "}
                      {transaction.stripe_payment_intent_id.substring(0, 20)}...
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
