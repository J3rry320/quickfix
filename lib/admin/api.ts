/**
 * Standardized Admin API Client
 * - Automatically injects CSRF headers (X-QuickFix-CSRF) for mutating HTTP requests
 * - Intercepts 401 Unauthorized errors and redirects to the login screen
 * - Normalizes backend error responses to readable Error instances
 * - Serializes query parameters cleanly
 */

export interface AdminApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export interface AdminFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function adminFetch<T = unknown>(
  endpoint: string,
  options: AdminFetchOptions = {}
): Promise<T> {
  const { body, params, headers = {}, ...restOptions } = options;

  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const reqHeaders = new Headers(headers);

  // Always set CSRF guard header for protection
  reqHeaders.set("X-QuickFix-CSRF", "1");

  let reqBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      reqBody = body;
      // Do not manually set Content-Type for FormData (browser sets boundary)
    } else if (typeof body === "string") {
      reqBody = body;
      if (!reqHeaders.has("Content-Type")) {
        reqHeaders.set("Content-Type", "application/json");
      }
    } else {
      reqBody = JSON.stringify(body);
      if (!reqHeaders.has("Content-Type")) {
        reqHeaders.set("Content-Type", "application/json");
      }
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: reqHeaders,
    body: reqBody,
  });

  // Handle session expiration
  if (response.status === 401 && typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith("/admin/login")) {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/admin/login?from=${encodeURIComponent(currentPath)}`;
      throw new Error("Your admin session has expired. Redirecting to login...");
    }
  }

  let json: AdminApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    throw new Error(`Server returned unexpected response (${response.status})`);
  }

  if (!response.ok || !json.success) {
    const errorMsg =
      json.error?.message ||
      (typeof json.error === "string" ? json.error : `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  return json.data as T;
}
