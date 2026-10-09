# Requerimientos: Acortador de URLs

## 1. El Problema
Los usuarios necesitan compartir enlaces web largos y complejos en redes sociales o mensajes, pero estos resultan visualmente molestos, difíciles de recordar y propensos a errores al copiarse.

## 2. Historias de Usuario (Funcionalidades Core)
- **Generar Enlace Corto:** Como usuario, quiero ingresar una URL larga y presionar un botón para obtener un enlace corto y único.
- **Redirección:** Como usuario, al visitar el enlace corto (ej: `/r/AbC12`), el sistema debe redirigirme automáticamente a la URL larga original en menos de 2 segundos.
- **Historial Local:** Como usuario, quiero ver una lista en la pantalla principal de los últimos 5 enlaces que he acortado, persistidos en LocalStorage.

## 3. Criterios de Aceptación
- Si el usuario ingresa un texto que no es una URL válida, el sistema debe mostrar un error claro.
- Solo se aceptan URLs con esquema `http` o `https` (rechazar otros esquemas, p. ej. `javascript:`).
- Los códigos cortos deben tener exactamente 6 caracteres alfanuméricos únicos (ej: `aB7zX9`).
- Si al generar un código el ID ya existe en Firestore, el sistema reintenta hasta 3 veces con un código nuevo.
- Si un código corto no existe en la base de datos, debe mostrar una página de error 404 personalizada (`not-found.tsx`).
