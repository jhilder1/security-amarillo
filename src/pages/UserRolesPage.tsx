import { useEffect, useState } from "react";
import GenericTable from "../components/GenericTable";
import { userService } from "../services/userService";
import { roleService } from "../services/roleService";
import { userRoleService } from "../services/userRoleService";
import { User } from "../models/User";
import { useOutletContext } from "react-router-dom";



import { Role } from "../models/Role";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

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

const UserRolesPage = () => {
    const { tableStyle } = useOutletContext<{ tableStyle: "material" | "bootstrap" | "tailwind" }>();
  const [users, setUsers] = useState<User[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");
  const [assignedRoles, setAssignedRoles] = useState<any[]>([]);

  const fetchRoles = async () => {
    const res = await roleService.getAll();
    setAvailableRoles(res.data);
  };

  const fetchUsers = async () => {
    const usersRes = await userService.getUsers();

    // Asegúrate de que los roles estén cargados
    if (availableRoles.length === 0) {
      await fetchRoles();
    }

    const rolesMap: Record<number, string[]> = {};

    for (const user of usersRes) {
      const userRolesRes = await userRoleService.getAssignedRoles(user.id);
      const enriched = enrichRoles(userRolesRes.data, availableRoles);
      rolesMap[user.id] = enriched.map((r) => r.name);
    }

    const enrichedUsers = usersRes.map((user) => ({
      ...user,
      rolesLabel: rolesMap[user.id]?.join(", ") || "Sin roles",
    }));

    setUsers(enrichedUsers);
  };

  const fetchAssignedRoles = async (userId: number) => {
    const res = await userRoleService.getAssignedRoles(userId);
    const enriched = enrichRoles(res.data, availableRoles);
    setAssignedRoles(enriched);
  };

  const handleAssign = async () => {
    if (selectedUserId !== null && selectedRoleId !== "") {
      await userRoleService.assignRole(selectedUserId, Number(selectedRoleId));
      await fetchAssignedRoles(selectedUserId);
      await fetchUsers(); // ← actualiza la tabla
      setSelectedRoleId("");
    }
  };

  const handleRemove = async (userRoleId: string) => {
    await userRoleService.removeRoleById(userRoleId);
    if (selectedUserId !== null) {
      await fetchAssignedRoles(selectedUserId);
      await fetchUsers(); // ← actualiza la tabla
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [availableRoles]);

  useEffect(() => {
    if (selectedUserId !== null) {
      fetchAssignedRoles(selectedUserId);
    }
  }, [selectedUserId]);

  return (
    <>
      <h2>Usuarios</h2>

      <GenericTable
        data={users}
        columns={["id", "name", "email", "rolesLabel"]}
        actions={[
          { name: "assign", label: "Asignar rol", color: "primary" },
        ]}
        onAction={(action, user) => {
          if (action === "assign") {
            setSelectedUserId(user.id!);
          }
        }}
            styleType={tableStyle}
      />

      <Dialog open={selectedUserId !== null} onClose={() => setSelectedUserId(null)}>
        <DialogTitle>Asignar rol al usuario #{selectedUserId}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Rol</InputLabel>
            <Select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value as number)}
              label="Rol"
            >
              {availableRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Roles asignados:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
            {assignedRoles.map((role) => (
              <Chip
                key={role.id}
                label={`Rol: ${role.name}`}
                onDelete={() => handleRemove(role.id)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUserId(null)}>Cerrar</Button>
          <Button
            onClick={handleAssign}
            variant="contained"
            disabled={selectedRoleId === ""}
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserRolesPage;
