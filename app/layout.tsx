import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AVATAR_URL } from "@/lib/projects";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const description =
  "Proyectos de Cristian Franco: desarrollo web, aplicaciones y herramientas para resolver tareas cotidianas.";

export const metadata: Metadata = {
  title: "Cristian Franco — Portafolio",
  description,
  authors: [{ name: "Cristian Franco" }],
  openGraph: {
    type: "website",
    title: "Cristian Franco — Portafolio",
    description,
    images: [
      {
        url: AVATAR_URL,
        width: 420,
        height: 420,
        alt: "Avatar de Cristian Franco",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Cristian Franco — Portafolio",
    description: "Proyectos de desarrollo web, aplicaciones y herramientas de gestión.",
    images: [AVATAR_URL],
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f5f7",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sans.variable} ${display.variable}`}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido principal
        </a>
        <div className="shell">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
