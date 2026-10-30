import Image from "next/image";
import { AVATAR_URL, GITHUB_PROFILE } from "@/lib/projects";
import { Button } from "./Button";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div>
        <p className={styles.eyebrow}>
          Desarrollo de software
        </p>
        <h1 className={styles.title} id="hero-title">
          Código que convierte tareas en herramientas útiles.
        </h1>
        <p className={styles.copy}>
          Soy Cristian Franco. Desarrollo proyectos web, aplicaciones y soluciones
          de gestión para resolver problemas cotidianos.
        </p>
        <div className={styles.actions}>
          <Button href="#proyectos">
            Ver proyectos <span aria-hidden="true">↓</span>
          </Button>
          <Button href={GITHUB_PROFILE} variant="secondary" external>
            Abrir GitHub <span aria-hidden="true">↗</span>
          </Button>
        </div>
      </div>
      <div className={styles.portraitStage}>
        <span className={styles.monogram} aria-hidden="true">
          cf
        </span>
        <Image
          className={styles.avatar}
          src={AVATAR_URL}
          alt="Avatar de Cristian Franco"
          width={420}
          height={420}
          preload
        />
        <div className={styles.portraitLabel}>
          <span>Cristian Franco</span>
          <span>@cristiandevar</span>
        </div>
      </div>
    </section>
  );
}
