import Link from "next/link";
import { GITHUB_PROFILE } from "@/lib/projects";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.topbar}>
      <Link className={styles.brand} href="#">
        <span className={styles.brandMark} aria-hidden="true">
          CF
        </span>
        <span className={styles.brandName}>Cristian Franco</span>
      </Link>
      <nav className={styles.nav} aria-label="Navegación principal">
        <ul>
          <li>
            <a href="#proyectos">Proyectos</a>
          </li>
          <li>
            <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
              GitHub
              <span aria-hidden="true">↗</span>
              <span className="visually-hidden">(se abre en una nueva pestaña)</span>
            </a>
          </li>
          <li>
            <a className={styles.cta} href="#contacto">
              Contacto
            </a>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
