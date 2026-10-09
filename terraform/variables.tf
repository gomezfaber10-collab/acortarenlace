variable "gcp_project_id" {
  description = "El ID del proyecto de Google Cloud donde se aprovisionarán los recursos."
  type        = string
}

variable "region" {
  description = "La región predeterminada de GCP para los recursos."
  type        = string
  default     = "us-central1"
}

variable "firestore_location_id" {
  description = "La ubicación para la base de datos Firestore (ej. nam5 para multirregión en EE.UU. o us-central1 para regional)."
  type        = string
  default     = "nam5"
}

variable "app_name" {
  description = "Nombre base de la aplicación para identificar los recursos."
  type        = string
  default     = "acortarenlace"
}

variable "container_image" {
  description = "URI de la imagen del contenedor a desplegar en Google Cloud Run. Por defecto usa una imagen inicial para permitir el aprovisionamiento de infraestructura antes del primer push a Artifact Registry."
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}
