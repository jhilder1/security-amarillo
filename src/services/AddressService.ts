import api from "../api/api"; // 👈 instancia de axios con baseURL ya configurada

const BASE_URL = "/addresses"; // 👈 sin /api porque ya está en la instancia `api`

export const addressService = {
  // 🔍 Obtener todas las direcciones
  getAll: async () => {
    return await api.get(`${BASE_URL}`);
  },

  // 🔍 Obtener dirección por usuario
  getByUser: async (userId: number) => {
    return await api.get(`${BASE_URL}/user/${userId}`);
  },

  // 🆕 Crear dirección para usuario
  create: async (userId: number, data: any) => {
    return await api.post(`${BASE_URL}/user/${userId}`, data);
  },

  // ✏️ Actualizar dirección por ID
  update: async (id: number, data: any) => {
    return await api.put(`${BASE_URL}/${id}`, data);
  },

  // 🗑️ Eliminar dirección por ID
  delete: async (id: number) => {
    return await api.delete(`${BASE_URL}/${id}`);
  },
};
