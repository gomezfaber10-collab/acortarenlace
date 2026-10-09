import { NextResponse } from "next/server";
import { generateShortCode, isValidHttpUrl } from "@/lib/utils";
import { firestore, URLS_COLLECTION, UrlRecord } from "@/lib/firestore";

const MAX_COLLISION_RETRIES = 3;

interface ShortenRequestBody {
  url?: string;
}

export async function POST(request: Request) {
  let body: ShortenRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido. Debe enviar un JSON con el campo 'url'." },
      { status: 400 }
    );
  }

  const rawUrl = body?.url;

  if (typeof rawUrl !== "string" || !isValidHttpUrl(rawUrl.trim())) {
    return NextResponse.json(
      {
        error:
          "La URL proporcionada no es válida. Debe ser una URL absoluta con protocolo http:// o https://.",
      },
      { status: 400 }
    );
  }

  const targetUrl = rawUrl.trim();

  try {
    const urlsCollection = firestore.collection(URLS_COLLECTION);

    for (let attempt = 1; attempt <= MAX_COLLISION_RETRIES; attempt++) {
      const code = generateShortCode();
      const docRef = urlsCollection.doc(code);
      const docSnapshot = await docRef.get();

      // Si el código no existe en Firestore, está libre para usarse
      if (!docSnapshot.exists) {
        const record: UrlRecord = {
          id: code,
          originalUrl: targetUrl,
          createdAt: new Date().toISOString(),
        };

        await docRef.set(record);

        return NextResponse.json(
          {
            id: record.id,
            originalUrl: record.originalUrl,
            shortUrl: `/r/${record.id}`,
          },
          { status: 201 }
        );
      }
    }

    // Si después de 3 intentos todos colisionaron con registros existentes
    return NextResponse.json(
      {
        error:
          "No fue posible generar un código único tras 3 intentos debido a colisiones. Por favor, intenta nuevamente.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error al guardar enlace en Firestore:", error);
    return NextResponse.json(
      {
        error:
          "Ocurrió un error interno al intentar almacenar el enlace en la base de datos.",
      },
      { status: 500 }
    );
  }
}
