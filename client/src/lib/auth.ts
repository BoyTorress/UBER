import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  return response.json();
}

export async function register(data: RegisterData): Promise<AuthUser> {
  const response = await apiRequest("POST", "/api/auth/register", data);
  return response.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiRequest("GET", "/api/auth/me");
  return response.json();
}
