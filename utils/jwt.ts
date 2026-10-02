type Claims = { userId: string; role: string; companyId: string | null; exp: number };

/** Reads the (unverified) claims out of our own access token, for UI state only. */
export function decodeToken(token: string | null): Claims | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)) as Claims;
  } catch {
    return null;
  }
}

export const isTokenExpired = (token: string | null) => {
  const claims = decodeToken(token);
  return !claims || claims.exp * 1000 <= Date.now();
};
