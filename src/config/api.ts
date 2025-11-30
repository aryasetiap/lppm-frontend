// API Configuration
const getApiBaseUrl = (): string => {
  // Check for environment variable first
  const envUrl = import.meta.env.VITE_LARAVEL_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  // Production fallback
  if (window.location.hostname === "lppm.unila.ac.id" || window.location.hostname.includes("unila.ac.id")) {
    return "https://lppm.unila.ac.id/api";
  }

  // Development fallback
  return "http://localhost:8000/api";
};

export const API_BASE_URL = getApiBaseUrl();

