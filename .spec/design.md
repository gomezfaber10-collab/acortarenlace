# Diseño Técnico y Arquitectura (Con Terraform)

## 1. Stack Tecnológico
- **Frontend & Backend (Fullstack):** Next.js (App Router) con TypeScript y Tailwind CSS.
- **Base de Datos:** Google Cloud Firestore (Modo Nativo).
- **Infraestructura como Código:** Terraform (para aprovisionar GCP automáticamente).
- **Despliegue:** Google Cloud Run (Serverless).

## 2. Modelo de Datos (Firestore Collection: `urls`)
Cada documento en la colección `urls` usará el ID generado aleatoriamente (el código de 6 caracteres) como ID del documento:
```json
{
  "id": "AbC123",
  "originalUrl": "https://google.com",
  "createdAt": "2026-10-08T17:00:00Z"
}
```

## 3. Arquitectura del Sistema
- `GET /`: Pantalla de inicio con el formulario para acortar y el historial.
- `POST /api/shorten`: Endpoint de la API que recibe la URL larga, genera el código de 6 caracteres, guarda en Firestore y devuelve el enlace corto.
- `GET /r/[code]`: Ruta dinámica de Next.js que busca el `code` en Firestore. Si existe, hace un redirect HTTP 302; si no, renderiza `not-found.tsx`.
- **Códigos:** alfanuméricos de 6 caracteres; si el ID de documento ya existe, reintentar hasta 3 veces.
- **Validación:** únicamente URLs absolutas con esquema `http` o `https`.
- **Historial:** los últimos 5 enlaces se guardan en LocalStorage del navegador.
- **Credenciales locales:** la app usa Application Default Credentials (ADC) de GCP; no se descarga una llave JSON de service account para desarrollo.
