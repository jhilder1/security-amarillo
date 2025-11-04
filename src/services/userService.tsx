// src/services/userService.ts
import { User } from "../models/User";
import api from "../api/api";

const API_URL = "/users";

class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  }

  async createUser(user: Omit<User, "id">): Promise<User | null> {
    try {
      const response = await api.post(API_URL, user);
      return response.data;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return null;
    }
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    try {
      const response = await api.put(`${API_URL}/${id}`, user);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await api.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return false;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Usuario no encontrado:", error);
      return null;
    }
  }
}

export const userService = new UserService();
