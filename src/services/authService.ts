// src/services/authService.ts
export const TOKEN_KEY = "Token"; // o "Token" si prefieres

export const authService = {
  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

 
};
