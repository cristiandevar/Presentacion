import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { AVATAR_URL, GITHUB_PROFILE } from "@/lib/projects";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Cristian Franco",
  jobTitle: "Desarrollador de software",
  url: GITHUB_PROFILE,
  image: AVATAR_URL,
  sameAs: [GITHUB_PROFILE],
};

export default function Home() {
  return (
    <>
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Projects />
        <Contact />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}
