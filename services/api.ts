import { API_URL, TOKEN_KEY } from "@/constants";

export const tokenStore = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  },
};

export class ApiError extends Error {
  status: number;
  /** Field-level messages from request validation, keyed by field name. */
  fields: Record<string, string>;

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => {
  onUnauthorized = fn;
};

/**
 * Did the call fail because our token is missing, expired or invalid?
 * Not every 401 means that: the API also answers 401 for a wrong password,
 * and it reports a bad or expired JWT as a plain error ("jwt expired", "jwt malformed", ...).
 */
const isSessionFailure = (status: number, message: string) =>
  (status === 401 && message === "You are not authorized") || /^(jwt |invalid (token|signature))/i.test(message);

type Options = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | undefined>;
  /** Don't send the token or run the "session expired" handling (login, signup, OTP). */
  anonymous?: boolean;
};

/** Calls the backend and unwraps the `{ success, message, data }` envelope. */
export async function api<T>(
  path: string,
  { method = "GET", body, query, anonymous }: Options = {}
): Promise<T> {
  const url = new URL(API_URL + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) if (v) url.searchParams.set(k, v);
  }

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = tokenStore.get();
  if (token && !anonymous) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection and try again.", 0);
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const message: string = json?.message ?? `Request failed (${res.status})`;
    if (!anonymous && isSessionFailure(res.status, message)) {
      onUnauthorized?.();
      throw new ApiError("Your session has expired. Please sign in again.", 401);
    }
    const fields: Record<string, string> = {};
    for (const e of (json?.errorMessages ?? []) as { path: string | number; message: string }[]) {
      // Zod paths look like "body.name" - keep the field name only
      const key = String(e.path).replace(/^(body|query)\./, "");
      if (key) fields[key] = e.message;
    }
    throw new ApiError(message, res.status, fields);
  }

  return json?.data as T;
}
