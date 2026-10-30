import { GITHUB_PROFILE } from "@/lib/projects";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span>© {year} Cristian Franco</span>
      <a
        className={styles.link}
        href={GITHUB_PROFILE}
        target="_blank"
        rel="noopener noreferrer"
      >
        @cristiandevar <span aria-hidden="true">↗</span>
        <span className="visually-hidden">(se abre en una nueva pestaña)</span>
      </a>
    </footer>
  );
}
