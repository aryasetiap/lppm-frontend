import { adminAuth } from "./adminAuth";

const apiBase = (): string =>
  (import.meta.env.VITE_LARAVEL_API_URL as string | undefined)?.replace(/\/$/, "") ||
  (window.location.hostname === "lppm.unila.ac.id" || window.location.hostname.includes("unila.ac.id")
    ? "https://lppm.unila.ac.id/api"
    : "http://localhost:8000/api");

export class AdminApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

const errorMessage = (body: unknown): string | null => {
  if (!body || typeof body !== "object") return null;

  const value = body as { message?: unknown; meta?: { message?: unknown } };
  if (typeof value.message === "string") return value.message;
  if (typeof value.meta?.message === "string") return value.meta.message;

  return null;
};

const adminRequest = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = adminAuth.getToken();
  if (!token) {
    throw new AdminApiError("Sesi admin tidak ditemukan. Silakan masuk kembali.", 401);
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${apiBase()}${path}`, {
    ...options,
    headers,
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AdminApiError(
      errorMessage(body) ?? "Data admin tidak dapat dimuat.",
      response.status,
    );
  }

  return body as T;
};

/** Read-only API helper for the new CMS interface. */
export const adminGet = async <T>(path: string, signal?: AbortSignal): Promise<T> =>
  adminRequest<T>(path, { signal, cache: "no-store" });

/** JSON mutation helper. Authorization remains enforced by Laravel. */
export const adminJson = async <T>(
  path: string,
  method: "POST" | "PATCH",
  body: Record<string, unknown>,
): Promise<T> =>
  adminRequest<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

/** Multipart helper. Never sets Content-Type manually so the browser supplies its boundary. */
export const adminForm = async <T>(path: string, body: FormData): Promise<T> =>
  adminRequest<T>(path, {
    method: "POST",
    body,
  });

/** Download a protected document without putting the Bearer token in its URL. */
export const adminDownload = async (path: string, fallbackFilename: string): Promise<void> => {
  const token = adminAuth.getToken();
  if (!token) throw new AdminApiError("Sesi admin tidak ditemukan. Silakan masuk kembali.", 401);

  const response = await fetch(`${apiBase()}${path}`, {
    headers: { Accept: "application/octet-stream", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new AdminApiError(errorMessage(body) ?? "Dokumen tidak dapat diunduh.", response.status);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fallbackFilename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
};
