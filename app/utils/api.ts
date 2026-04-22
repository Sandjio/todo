import axios from "axios";

export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class AuthError extends ApiError {
  constructor(status: number, message: string, data?: unknown) {
    super(status, message, data);
    this.name = "AuthError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

export function isAuthError(e: unknown): e is AuthError {
  return e instanceof AuthError;
}

export const todoistApi = axios.create({
  baseURL: "/api/todoist",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TODOIST_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

todoistApi.interceptors.request.use((config) => {
  config.headers["X-Request-ID"] = crypto.randomUUID();
  if (import.meta.env.DEV) {
    console.log(
      `[API] ${config.method?.toUpperCase()} ${config.url}`,
      config.params ?? {},
    );
  }
  return config;
});

todoistApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      return Promise.reject(new NetworkError(error.message));
    }
    const { status, data } = error.response;
    const message =
      (data as Record<string, string>)?.error ?? error.message;
    if (status === 401 || status === 403) {
      return Promise.reject(new AuthError(status, message, data));
    }
    return Promise.reject(new ApiError(status, message, data));
  },
);
