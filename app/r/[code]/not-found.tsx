import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 text-center transition-all">
        <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
          <svg
            width={32}
            height={32}
            className="w-8 h-8 text-rose-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-200 rounded-full uppercase mb-3">
          Error 404
        </span>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Enlace no encontrado
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          El enlace corto que estás intentando visitar no existe en nuestro sistema,
          ha caducado o el código ingresado no tiene un formato válido.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg
            width={16}
            height={16}
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a la página principal
        </Link>
      </div>
    </main>
  );
}
