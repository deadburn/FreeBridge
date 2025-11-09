import React from "react";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <title>FreeBridge - Conecta talento con oportunidades</title>

      <div className={styles.logo_container}>
        <img src="/src/assets/freebridge.svg" alt="FreeBridge Logo" />
      </div>

      <h1>Bienvenido a FreeBridge</h1>
      <div className={styles.texto}>
        <h2>Haz parte de la comunidad de Freelancers mas grande de Colombia</h2>
        <br />
      </div>
    </div>
  );
}
