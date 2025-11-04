import api from "../api/api";
import { Role } from "../models/Role";

export const userRoleService = {
  // Obtener roles de un usuario
  getAssignedRoles: (userId: number) =>
    api.get(`/user-roles/user/${userId}`),

  // Asignar rol
  assignRole: (userId: number, roleId: number) =>
    api.post(`/user-roles/user/${userId}/role/${roleId}`, {
      startAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      endAt: "2025-12-31 23:59:59"
    }),

  // Quitar rol
removeRoleById: (userRoleId: string) =>
  api.delete(`/user-roles/${userRoleId}`),

};