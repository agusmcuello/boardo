import { redirect } from "next/navigation";

class ApiClient {
  private baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (response.status === 401) {
      localStorage.removeItem("token");
      redirect("/login");
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

export const api = new ApiClient();
