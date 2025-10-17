import { API_BASE_URL, HttpStatus } from "../utils/constants";
import type { ApiError } from "../types/http";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

interface HttpApiError extends ApiError {
  status: number;
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, "");
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Key-Inflection": "camel",
    };
  }

  private async request<T = any>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const requestConfig: RequestInit = {
      method: config.method || "GET",
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
      },
      credentials: config.credentials || "include", // Include cookies for auth
    };

    // Add body for non-GET requests
    if (config.body && config.method !== "GET") {
      if (typeof config.body === "object") {
        requestConfig.body = JSON.stringify(config.body);
      } else {
        requestConfig.body = config.body;
      }
    }

    try {
      const response = await fetch(url, requestConfig);

      // Handle empty responses (like 204 No Content)
      let data: T;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as T;
      }

      if (!response.ok) {
        // API returned an error
        const error: HttpApiError = {
          message:
            (data as any)?.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          errors: (data as any)?.errors || [],
          status: response.status,
        };
        throw error;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      // Network error or JSON parsing error
      if (error instanceof Error && !(error as any).status) {
        const apiError: HttpApiError = {
          message: "Network error or server unavailable",
          errors: [error.message],
          status: HttpStatus.InternalServerError,
        };
        throw apiError;
      }

      // Re-throw API errors
      throw error;
    }
  }

  async get<T = any>(
    endpoint: string,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  async delete<T = any>(
    endpoint: string,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  // Helper method to set default headers
  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  // Helper method to remove default headers
  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}

// Create and export a configured instance
const httpClient = new HttpClient(API_BASE_URL);

export default httpClient;
export { HttpClient, type ApiResponse, type HttpApiError };
