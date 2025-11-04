import api from "../api/api";

export const passwordService = {
  getByUser: (userId: number) =>
    api.get(`/passwords/user/${userId}`),

  create: (userId: number, data: any) =>
    api.post(`/passwords/user/${userId}`, data),

  delete: (passwordId: number) =>
    api.delete(`/passwords/${passwordId}`),
};
