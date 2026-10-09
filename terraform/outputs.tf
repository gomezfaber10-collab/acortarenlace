output "project_id" {
  description = "El ID del proyecto de Google Cloud configurado."
  value       = var.gcp_project_id
}

output "region" {
  description = "La región configurada en GCP."
  value       = var.region
}

output "firestore_database_name" {
  description = "El nombre de la base de datos Firestore provisionada."
  value       = google_firestore_database.database.name
}

output "firestore_database_id" {
  description = "El identificador del recurso de Firestore."
  value       = google_firestore_database.database.id
}

output "firestore_location_id" {
  description = "Ubicación geográfica asignada a Firestore."
  value       = google_firestore_database.database.location_id
}

output "service_account_email" {
  description = "Correo electrónico de la Service Account creada."
  value       = google_service_account.app_sa.email
}

output "artifact_registry_repository_id" {
  description = "Identificador del repositorio en Google Artifact Registry."
  value       = google_artifact_registry_repository.app_repo.id
}

output "artifact_registry_repository_url" {
  description = "URL base del repositorio de Artifact Registry para etiquetar y subir imágenes Docker."
  value       = "${var.region}-docker.pkg.dev/${var.gcp_project_id}/${google_artifact_registry_repository.app_repo.repository_id}"
}

output "cloud_run_service_name" {
  description = "Nombre del servicio de Google Cloud Run desplegado."
  value       = google_cloud_run_v2_service.app_service.name
}

output "cloud_run_url" {
  description = "URL pública generada por Google Cloud Run para acceder a la aplicación."
  value       = google_cloud_run_v2_service.app_service.uri
}
