import { Firestore } from "@google-cloud/firestore";

/**
 * Representación del modelo de datos para los enlaces acortados almacenados en Firestore.
 * Colección: 'urls'
 * Document ID: código alfanumérico de 6 caracteres (ej. 'AbC123')
 */
export interface UrlRecord {
  id: string;
  originalUrl: string;
  createdAt: string;
}

export const URLS_COLLECTION = "urls";

const projectId =
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  "acortarenlace";

const databaseId = process.env.FIRESTORE_DATABASE_ID || "(default)";

// Patrón Singleton para evitar múltiples instancias de conexión en Next.js durante recargas (HMR) en desarrollo
const globalForFirestore = globalThis as unknown as {
  firestoreInstance?: Firestore;
};

export const firestore: Firestore =
  globalForFirestore.firestoreInstance ??
  new Firestore({
    projectId,
    databaseId,
  });

if (process.env.NODE_ENV !== "production") {
  globalForFirestore.firestoreInstance = firestore;
}
