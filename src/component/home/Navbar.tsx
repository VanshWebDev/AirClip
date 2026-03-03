import styles from "../../styles/component/home/Navbar.module.css";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const navigateToLogin = (route: string) => {
    navigate(`${route}`);
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span className={styles.logoMark}>◆</span>
          <span className={styles.logoText}>Ariclip</span>
        </div>
        <div className={styles.navActions}>
          <button
            className={styles.navLoginBtn}
            onClick={() => navigateToLogin("/login")}
          >
            Log in
          </button>
          <button
            className={styles.navSignupBtn}
            onClick={() => navigateToLogin("/signup")}
          >
            Get started
          </button>
        </div>
      </nav>
    </div>
  );
};