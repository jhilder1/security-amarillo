import { Role } from "./Role";

export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  city?: string;
  phone?: string;
  is_active?: boolean;
  token?: string;
  role_id?: number;
  address_id?: number;
  profile_id?: number;

  // ✅ Roles asignados al usuario
  roles?: Role[];
}
