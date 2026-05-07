const TOKEN_KEY = "lppm-admin-token";
const USER_KEY = "lppm-admin-user";

const isHex64 = (value: string | null): boolean =>
  typeof value === "string" && /^[a-f0-9]{64}$/i.test(value);

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
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, displayName);
  },
  hasValidToken: () => {
    if (typeof window === "undefined") return false;
    return isHex64(localStorage.getItem(TOKEN_KEY));
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

