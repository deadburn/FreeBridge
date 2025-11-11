import React from "react";
import { MdPerson, MdWork } from "react-icons/md";
import styles from "../styles/CompanyDashboard.module.css";

export default function FreelancerSidebar({
  userName,
  activeView,
  onViewChange,
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarLarge}>
          <MdPerson size={48} />
        </div>
        <h2 className={styles.userName}>{userName || "Freelancer"}</h2>
        <div className={styles.ratingDisplay}>
          <span className={styles.ratingValue}>5.0</span>
          <span className={styles.stars}>★★★★★</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${
            activeView === "freelancer" ? styles.navItemActive : ""
          }`}
          onClick={() => onViewChange("freelancer")}
        >
          <MdPerson className={styles.navIcon} />
          <span className={styles.navText}>Freelancer</span>
        </button>

        <button
          className={`${styles.navItem} ${
            activeView === "vacantes" ? styles.navItemActive : ""
          }`}
          onClick={() => onViewChange("vacantes")}
        >
          <MdWork className={styles.navIcon} />
          <span className={styles.navText}>Consultar vacante</span>
        </button>
      </nav>
    </aside>
  );
}
