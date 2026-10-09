import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acortador de URLs | Rápido, seguro y confiable",
  description: "Acorta URLs largas a enlaces únicos de 6 caracteres con alta velocidad y persistencia en Google Cloud Firestore.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
