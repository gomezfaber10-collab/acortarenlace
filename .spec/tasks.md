# Plan de Ejecución (Tasks)

## Fase 1: Inicialización del Proyecto
- [x] Tarea 1.1: Inicializar el proyecto Next.js con TypeScript y Tailwind CSS en la carpeta raíz.
- [x] Tarea 1.2: Limpiar los archivos iniciales (`page.tsx`, `globals.css`) para dejar el layout base limpio.

## Fase 2: Infraestructura con Terraform (GCP & Firestore)
- [x] Tarea 2.1: Crear los archivos de Terraform (`main.tf`, `variables.tf`, `outputs.tf`) para habilitar las APIs de GCP, crear la base de datos Firestore en modo Nativo y una Service Account con accesos.
- [x] Tarea 2.2: Configurar el entorno local con Application Default Credentials (`gcloud auth application-default login`) y variables de proyecto en `.env.local` (sin descargar llave JSON de service account).

## Fase 3: Lógica de la Aplicación y Endpoints
- [x] Tarea 3.1: Crear la función utilitaria para generar códigos alfanuméricos aleatorios de 6 caracteres.
- [x] Tarea 3.2: Crear el endpoint de la API `POST /api/shorten`: validar solo `http`/`https`, guardar en Firestore y reintentar hasta 3 veces si el código ya existe.
- [x] Tarea 3.3: Crear la ruta de redirección dinámica `GET /r/[code]` para consultar Firestore y redirigir; códigos inexistentes usan `not-found.tsx`.

## Fase 4: Interfaz de Usuario (Frontend)
- [x] Tarea 4.1: Diseñar el formulario de entrada en la página principal con Tailwind CSS (Input, Botón de acortar, manejo de errores).
- [x] Tarea 4.2: Implementar el historial de los últimos 5 enlaces generados en la sesión (usando LocalStorage).

## Fase 5: Despliegue en Google Cloud Run
- [x] Tarea 5.1: Crear el archivo `Dockerfile` optimizado para Next.js.
- [x] Tarea 5.2: Agregar a Terraform el recurso de Google Cloud Run para automatizar por completo el despliegue de la app.
