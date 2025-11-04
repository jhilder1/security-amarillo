import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import GenericTable from "../components/GenericTable";
import UserForm from "../components/UserForm";
import { userService } from "../services/userService";
import { roleService } from "../services/roleService";
import { userRoleService } from "../services/userRoleService";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { useOutletContext } from "react-router-dom";



const columns = ["id", "name", "email", "rolesLabel"];

const actions = [
  { name: "edit", label: "Editar", color: "primary" },
  { name: "delete", label: "Eliminar", color: "error" },
];

// ✅ Enriquecer roles con nombre usando role_id
const enrichRoles = (userRoles: any[], allRoles: Role[]) => {
  return userRoles.map((ur) => {
    const role = allRoles.find((r) => r.id === ur.role_id);
    return {
      ...ur,
      name: role?.name || `Rol #${ur.role_id}`,
    };
  });
};

const UsuariosPage = () => {
    const { tableStyle } = useOutletContext<{ tableStyle: "material" | "bootstrap" | "tailwind" }>();
  const [data, setData] = useState<User[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchRoles = async () => {
    const res = await roleService.getAll();
    setAvailableRoles(res.data);
  };

  const fetchUsers = async () => {
    const users = await userService.getUsers();

    // Asegúrate de que los roles estén cargados
    if (availableRoles.length === 0) {
      await fetchRoles();
    }

    const rolesMap: Record<number, string[]> = {};

    for (const user of users) {
      const userRolesRes = await userRoleService.getAssignedRoles(user.id);
      const enriched = enrichRoles(userRolesRes.data, availableRoles);
      rolesMap[user.id] = enriched.map((r) => r.name);
    }

    const enrichedUsers = users.map((user) => ({
      ...user,
      rolesLabel: rolesMap[user.id]?.join(", ") || "Sin roles",
    }));

    setData(enrichedUsers);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [availableRoles]);

  const handleAction = async (name: string, item: User) => {
    if (name === "delete") {
      const success = await userService.deleteUser(item.id);
      if (success) {
        setData((prev) => prev.filter((u) => u.id !== item.id));
      }
    }

    if (name === "edit") {
      setEditingUser(item);
      setFormOpen(true);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleSubmit = async (formData: Omit<User, "id">) => {
    if (editingUser) {
      const updated = await userService.updateUser(editingUser.id, formData);
      if (updated) {
        await fetchUsers(); // ← actualiza con roles
      }
    } else {
      const created = await userService.createUser(formData);
      if (created) {
        await fetchUsers(); // ← actualiza con roles
      }
    }
    setFormOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>

      <Button variant="contained" onClick={handleCreate} sx={{ mb: 2 }}>
        Nuevo Usuario
      </Button>

      <GenericTable
        data={data}
        columns={columns}
        actions={actions}
        onAction={handleAction}
         styleType={tableStyle}
      />

      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingUser}
      />
    </Box>
  );
};

export default UsuariosPage;
