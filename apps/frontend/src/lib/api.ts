// lib/api.ts
export class ApiError extends Error {
  status: number;
  data?: any;
  constructor(message: string, status = 500, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseURL = "http://localhost:4000/api";
  private token: string | null = null;

  setToken(token?: string | null) {
    this.token = token ?? null;
    try {
      if (typeof window !== "undefined") {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
      }
    } catch (e) {
      // noop
    }
  }

  // cargar token desde storage (cuando inicie la app)
  initFromStorage() {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("token");
    if (t) this.token = t;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // build headers
    const headers = new Headers(options.headers || {});
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const token =
      this.token ??
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const url = `${this.baseURL.replace(/\/$/, "")}/${endpoint.replace(
      /^\//,
      ""
    )}`;

    const config: RequestInit = {
      ...options,
      headers,
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (err: any) {
      throw new ApiError(err.message || "Network error", 0);
    }

    if (response.status === 401) {
      let body: any = null;
      try {
        body = await response.json();
      } catch {}

      const message = body?.error || "Usuario o contraseña incorrecta";
      // ⚠️ solo limpiar token si la request es distinta a login
      if (!endpoint.includes("auth/login")) {
        this.setToken(null);
      }

      throw new ApiError(message, 401, body);
    }

    if (!response.ok) {
      // try to read JSON body
      let body: any = null;
      const ct = response.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        try {
          body = await response.json();
        } catch {}
      } else {
        try {
          body = await response.text();
        } catch {}
      }
      const message =
        (body && (body.message || body.error)) ||
        response.statusText ||
        "API Error";
      throw new ApiError(message, response.status, body);
    }

    // No Content
    if (response.status === 204) {
      return null as unknown as T;
    }

    // If not json, return text
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      return text as unknown as T;
    }

    return (await response.json()) as T;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  del<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
export type { ApiClient };
