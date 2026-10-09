const ALPHANUMERIC_CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Genera un código alfanumérico aleatorio de longitud fija (por defecto 6 caracteres).
 * Utiliza Web Crypto API para aleatoriedad criptográficamente segura compatible tanto en Node.js como en el navegador.
 */
export function generateShortCode(length = 6): string {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += ALPHANUMERIC_CHARSET[bytes[i] % ALPHANUMERIC_CHARSET.length];
    }
    return result;
  }

  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHANUMERIC_CHARSET.length);
    result += ALPHANUMERIC_CHARSET[randomIndex];
  }
  return result;
}

/**
 * Valida si una cadena es una URL absoluta válida con esquema http o https.
 * Rechaza esquemas inseguros o no soportados (ej. javascript:, data:, file:).
 */
export function isValidHttpUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Valida si un código corto cumple exactamente con 6 caracteres alfanuméricos.
 */
export function isValidShortCode(code: string): boolean {
  return /^[a-zA-Z0-9]{6}$/.test(code);
}
