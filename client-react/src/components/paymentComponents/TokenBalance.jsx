import React from "react";
import { useState, useEffect } from "react";
import { MdAccountBalanceWallet } from "react-icons/md";
import { getTokenBalance } from "../../api/paymentApi";
import TokenPurchase from "./TokenPurchase";
import styles from "../../styles/modules_payment/TokenBalance.module.css";

const TokenBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const data = await getTokenBalance();
      setBalance(data);
    } catch (error) {
      console.error("Error al obtener el balance de tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSuccess = () => {
    fetchBalance(); // Recargar el balance después de una compra exitosa
  };

  if (loading) {
    return (
      <div className={styles.tokenBalanceCard}>
        <div className={styles.loading}>Cargando balance...</div>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className={styles.tokenBalanceCard}>
        <div className={styles.error}>No se pudo cargar el balance</div>
      </div>
    );
  }

  const hasTokens = balance.tokens_disponibles > 0;
  const totalTokens = balance.tokens_totales || balance.total_adquiridos || 0;
  const usagePercentage =
    totalTokens > 0 ? (balance.tokens_usados / totalTokens) * 100 : 0;

  return (
    <>
      <div className={styles.tokenBalanceCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <MdAccountBalanceWallet className={styles.icon} />
          </div>
          <h3 className={styles.title}>Balance de Tokens</h3>
        </div>

        <div className={styles.balanceSection}>
          <div className={styles.mainBalance}>
            <span className={styles.availableLabel}>Tokens disponibles</span>
            <span
              className={`${styles.tokenCount} ${
                !hasTokens ? styles.lowTokens : ""
              }`}
            >
              {balance.tokens_disponibles}
            </span>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tokens usados</span>
              <span className={styles.statValue}>{balance.tokens_usados}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total adquiridos</span>
              <span className={styles.statValue}>{totalTokens}</span>
            </div>
          </div>

          {totalTokens > 0 && (
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <p className={styles.progressText}>
                {usagePercentage.toFixed(0)}% de tokens utilizados
              </p>
            </div>
          )}
        </div>

        {!hasTokens && (
          <div className={styles.warningBox}>
            <span className={styles.warningIcon}>⚠️</span>
            <p>No tienes tokens disponibles para publicar vacantes</p>
          </div>
        )}

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.checkIcon}>✓</span>
            <span>1 token = 1 vacante publicada</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.checkIcon}>✓</span>
            <span>1 token = $12,000 COP (≈ $3 USD)</span>
          </div>
        </div>

        <button
          className={styles.buyButton}
          onClick={() => setShowPurchaseModal(true)}
        >
          <span className={styles.buttonIcon}>🛒</span>
          Comprar Tokens
        </button>
      </div>

      {showPurchaseModal && (
        <TokenPurchase
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </>
  );
};

export default TokenBalance;
