import axios from "axios";
import { authService } from "../services/authService";

const EXCLUDED_ROUTES = ["/login", "/register"];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(

  (request) => {
    console.log("Interceptando:", request.url);
       
    const isExcluded = EXCLUDED_ROUTES.some((route) =>
      request.url?.includes(route)
    );
    if (isExcluded) return request;

    const token = authService.getToken();
      console.log("Token obtenido:", token);
    if (token) {
      console.log("Token1111 obtenido:", token);
        request.headers.Authorization = `Bearer ${token}`;
      console.log("Header agregado:", request.headers["Authorization"]);
    }
    return request;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sesión expirada. Redirigiendo a login...");
      authService.logout();
    }
    return Promise.reject(error);
  }
);

export default api;
