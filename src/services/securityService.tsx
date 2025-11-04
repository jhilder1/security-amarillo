// src/services/securityService.ts
import { User } from "../models/User";
import api from "../api/api";

class SecurityService {
  private readonly keySession = "token";
  private readonly keyUser = "user";
  private readonly loginEndpoint = "/login";

  async login(credentials: Pick<User, "email" | "password">): Promise<User | null> {
    try {
      const response = await api.post(this.loginEndpoint, credentials);
      const { token, user } = response.data;

      localStorage.setItem(this.keySession, token);
      localStorage.setItem(this.keyUser, JSON.stringify(user));

      return user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.keySession);
    localStorage.removeItem(this.keyUser);
    window.location.href = "/login";
  }

  getToken(): string | null {
    return localStorage.getItem(this.keySession);
  }

  getUser(): User | null {
    const stored = localStorage.getItem(this.keyUser);
    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const securityService = new SecurityService();
