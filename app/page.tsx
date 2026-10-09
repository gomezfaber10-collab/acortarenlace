"use client";

import { useState, useEffect, type FormEvent } from "react";
import { isValidHttpUrl } from "@/lib/utils";

interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
}

const STORAGE_KEY = "acortarenlace_history_v1";
const MAX_HISTORY_ITEMS = 5;

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latestLink, setLatestLink] = useState<ShortenedLink | null>(null);
  const [history, setHistory] = useState<ShortenedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  // Cargar origen y elementos guardados en LocalStorage al montar el cliente
  useEffect(() => {
    setHasMounted(true);
    setOrigin(window.location.origin);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, MAX_HISTORY_ITEMS));
        }
      }
    } catch (err) {
      console.warn("No se pudo leer el historial de LocalStorage:", err);
    }
  }, []);

  // Guardar en LocalStorage ante actualizaciones del historial
  const saveToHistory = (newLink: ShortenedLink) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== newLink.id);
      const updated = [newLink, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn("No se pudo persistir el historial en LocalStorage:", err);
      }

      return updated;
    });
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("No se pudo limpiar LocalStorage:", err);
    }
    setHistory([]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setErrorMessage("Por favor, ingresa una URL para acortar.");
      return;
    }

    if (!isValidHttpUrl(trimmedUrl)) {
      setErrorMessage(
        "Ingresa una URL válida que comience con http:// o https:// (ej. https://google.com)."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Ocurrió un error inesperado al procesar la solicitud."
        );
      }

      const newRecord: ShortenedLink = {
        id: data.id,
        originalUrl: data.originalUrl,
        shortUrl: data.shortUrl,
        createdAt: new Date().toISOString(),
      };

      setLatestLink(newRecord);
      saveToHistory(newRecord);
      setUrl("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al conectar con el servidor.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (id: string, textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((curr) => (curr === id ? null : curr));
      }, 2000);
    } catch (err) {
      console.error("No se pudo copiar al portapapeles:", err);
    }
  };

  const formatShortUrl = (shortPath: string) => {
    return origin ? `${origin}${shortPath}` : shortPath;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("es", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Fondo con resplandores decorativos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10rem] left-1/2 -translate-x-1/2 w-[42rem] h-[28rem] bg-indigo-600/15 blur-[120px] rounded-full" />
        <div className="absolute top-40 right-[-10rem] w-[26rem] h-[26rem] bg-violet-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 left-[-8rem] w-[28rem] h-[28rem] bg-sky-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Contenido Principal */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center">
        {/* Cabecera */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-indigo-400 font-medium mb-4 backdrop-blur-sm shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Next.js App Router • GCP Firestore
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Acorta tus enlaces en{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">
              segundos
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Genera enlaces cortos y seguros de 6 caracteres con redirección
            inmediata respaldada por Firestore.
          </p>
        </div>

        {/* Tarjeta del Formulario */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl ring-1 ring-white/5 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="https://ejemplo.com/tu-enlace-largo-a-acortar..."
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Acortando...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    Acortar
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            {/* Mensaje de Error */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm animate-fadeIn"
              >
                <svg
                  className="w-4 h-4 text-rose-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          {/* Enlace Recién Creado */}
          {latestLink && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  ¡Enlace acortado con éxito!
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ID: {latestLink.id}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                <div className="min-w-0 flex-1">
                  <a
                    href={formatShortUrl(latestLink.shortUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-mono font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 truncate block"
                  >
                    {formatShortUrl(latestLink.shortUrl)}
                  </a>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {latestLink.originalUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        latestLink.id,
                        formatShortUrl(latestLink.shortUrl)
                      )
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      copiedId === latestLink.id
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    }`}
                  >
                    {copiedId === latestLink.id ? (
                      <>
                        <svg
                          className="w-3.5 h-3.5 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-3.5 h-3.5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        Copiar
                      </>
                    )}
                  </button>

                  <a
                    href={formatShortUrl(latestLink.shortUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
                    title="Abrir enlace"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección de Historial Local */}
        <section className="bg-slate-900/50 border border-slate-800/70 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-sm font-semibold text-slate-200">
                Últimos enlaces acortados
              </h2>
              {hasMounted && history.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400">
                  {history.length} / {MAX_HISTORY_ITEMS}
                </span>
              )}
            </div>

            {hasMounted && history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Limpiar historial
              </button>
            )}
          </div>

          {/* Lista de Enlaces */}
          {!hasMounted ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Cargando historial local...
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center">
              <svg
                className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-xs text-slate-500">
                Aún no has acortado ningún enlace en este navegador.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {history.map((item) => {
                const fullShortUrl = formatShortUrl(item.shortUrl);
                const isCopied = copiedId === item.id;

                return (
                  <li
                    key={item.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/60 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={fullShortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                        >
                          {fullShortUrl}
                        </a>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <p
                        className="text-xs text-slate-500 truncate mt-0.5"
                        title={item.originalUrl}
                      >
                        {item.originalUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, fullShortUrl)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isCopied
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80"
                        }`}
                        title="Copiar enlace corto"
                      >
                        {isCopied ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5 text-emerald-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            ¡Copiado!
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3.5 h-3.5 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            Copiar
                          </>
                        )}
                      </button>

                      <a
                        href={fullShortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition-colors"
                        title="Abrir en pestaña nueva"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      {/* Pie de Página */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500 border-t border-slate-900">
        <p>
          Acortador de URLs • Construido con Next.js 16, TypeScript, Tailwind CSS &amp; Google Cloud Firestore.
        </p>
      </footer>
    </div>
  );
}
