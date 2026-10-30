import { GITHUB_PROFILE } from "@/lib/projects";
import { Button } from "./Button";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section className={styles.closing} id="contacto" aria-labelledby="contact-title">
      <div>
        <h2 className={styles.title} id="contact-title">
          ¿Quiere ver cómo está hecho?
        </h2>
        <p className={styles.copy}>
          Explore el código y los detalles de cada proyecto en GitHub.
        </p>
      </div>
      <Button href={GITHUB_PROFILE} variant="accent" external className={styles.action}>
        Abrir perfil de GitHub <span aria-hidden="true">↗</span>
      </Button>
    </section>
  );
}
