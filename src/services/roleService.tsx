import api from "../api/api";
import { Role } from "../models/Role";

export const roleService = {
  getAll: () => api.get<Role[]>("/roles"),
  create: (data: Omit<Role, "id">) => api.post("/roles", data),
  update: (id: number, data: Omit<Role, "id">) => api.put(`/roles/${id}`, data),
  delete: (id: number) => api.delete(`/roles/${id}`),
};
