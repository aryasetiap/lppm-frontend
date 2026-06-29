const TOKEN_KEY = "lppm-admin-token";
const USER_KEY = "lppm-admin-user";

/** Sanctum plain token: "12|xxxx"; some setups use a bare 64-char secret */
const looksLikeStoredAdminToken = (value: string | null): boolean => {
  if (typeof value !== "string") return false;
  const t = value.trim();
  if (t.length < 8) return false;
  if (/^[a-f0-9]{64}$/i.test(t)) return true;
  return /^\d+\|[A-Za-z0-9_-]+$/.test(t);
};

const normalizeToken = (token: string): string => {
  let t = token.trim();
  if (/^bearer\s+/i.test(t)) t = t.replace(/^bearer\s+/i, "").trim();
  return t;
};

export const adminAuth = {
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  getUser: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_KEY);
  },
  login: (token: string, displayName: string) => {
    localStorage.setItem(TOKEN_KEY, normalizeToken(token));
    localStorage.setItem(USER_KEY, displayName);
  },
  hasValidToken: () => {
    if (typeof window === "undefined") return false;
    return looksLikeStoredAdminToken(localStorage.getItem(TOKEN_KEY));
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

