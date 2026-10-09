terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.6"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.region
}

# 1. Habilitación de APIs necesarias en Google Cloud
locals {
  services = [
    "cloudresourcemanager.googleapis.com",
    "serviceusage.googleapis.com",
    "firestore.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com"
  ]
}

resource "google_project_service" "apis" {
  for_each = toset(local.services)

  project            = var.gcp_project_id
  service            = each.key
  disable_on_destroy = false
}

# 2. Base de datos Firestore en modo Nativo
resource "google_firestore_database" "database" {
  project     = var.gcp_project_id
  name        = "(default)"
  location_id = var.firestore_location_id
  type        = "FIRESTORE_NATIVE"

  concurrency_mode            = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"
  deletion_policy             = "DELETE"

  depends_on = [
    google_project_service.apis["firestore.googleapis.com"]
  ]
}

# 3. Service Account para la aplicación (Cloud Run)
resource "google_service_account" "app_sa" {
  account_id   = "${var.app_name}-sa"
  display_name = "Service Account para ${var.app_name}"
  description  = "Identidad de servicio para lectura y escritura en Firestore y ejecución de Cloud Run"
  project      = var.gcp_project_id

  depends_on = [
    google_project_service.apis["cloudresourcemanager.googleapis.com"]
  ]
}

# 4. Rol IAM para que la Service Account pueda interactuar con Firestore
resource "google_project_iam_member" "firestore_user" {
  project = var.gcp_project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.app_sa.email}"
}

# 5. Repositorio en Google Artifact Registry para almacenar las imágenes Docker
resource "google_artifact_registry_repository" "app_repo" {
  project       = var.gcp_project_id
  location      = var.region
  repository_id = "${var.app_name}-repo"
  description   = "Repositorio Docker para ${var.app_name}"
  format        = "DOCKER"

  depends_on = [
    google_project_service.apis["artifactregistry.googleapis.com"]
  ]
}

# 6. Servicio Google Cloud Run (V2) para alojar la aplicación Next.js
resource "google_cloud_run_v2_service" "app_service" {
  name     = var.app_name
  location = var.region
  project  = var.gcp_project_id
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.app_sa.email

    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }

    containers {
      image = var.container_image

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      ports {
        container_port = 8080
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }



      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.gcp_project_id
      }

      env {
        name  = "GCLOUD_PROJECT"
        value = var.gcp_project_id
      }

      env {
        name  = "FIRESTORE_DATABASE_ID"
        value = google_firestore_database.database.name
      }
    }
  }

  depends_on = [
    google_project_service.apis["run.googleapis.com"],
    google_firestore_database.database
  ]
}

# 7. Acceso público general (allUsers) a Cloud Run para visitantes de internet
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = var.gcp_project_id
  location = google_cloud_run_v2_service.app_service.location
  name     = google_cloud_run_v2_service.app_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
