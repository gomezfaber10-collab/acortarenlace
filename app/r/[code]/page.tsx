import { notFound, redirect, RedirectType } from "next/navigation";
import { connection } from "next/server";
import { isValidShortCode } from "@/lib/utils";
import { firestore, URLS_COLLECTION, UrlRecord } from "@/lib/firestore";

export const instant = false;

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function RedirectPage({ params }: PageProps) {
  await connection();
  const { code } = await params;

  if (!code || !isValidShortCode(code)) {
    notFound();
  }

  let originalUrl: string | null = null;

  try {
    const docRef = firestore.collection(URLS_COLLECTION).doc(code);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      const data = docSnapshot.data() as UrlRecord | undefined;
      if (data?.originalUrl) {
        originalUrl = data.originalUrl;
      }
    }
  } catch (error) {
    console.error(`Error al consultar Firestore para el código "${code}":`, error);
    notFound();
  }

  if (!originalUrl) {
    notFound();
  }

  // Redirección nativa de Next.js hacia la URL larga
  redirect(originalUrl, RedirectType.replace);
}
