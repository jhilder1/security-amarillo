import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { userService } from "../services/userService";
import { passwordService } from "../services/passwordService";
import GenericTable from "../components/GenericTable";
import { User } from "../models/User";
import { useOutletContext } from "react-router-dom";



const userColumns = ["id", "name", "email"];
const passwordColumns = ["id", "content", "startAt", "endAt"];

const userActions = [
  { name: "crear", label: "Crear contraseña", color: "success" },
  { name: "ver", label: "Ver contraseñas", color: "primary" },
];

const passwordActions = [
  { name: "delete", label: "Eliminar", color: "error" },
];

const formatDateForBackend = (input: string) => {
  const date = new Date(input);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const formatDateForDisplay = (input: string) =>
  new Date(input).toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });

const UserPasswordsPage = () => {
    
const { tableStyle } = useOutletContext<{ tableStyle: "material" | "bootstrap" | "tailwind" }>();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserForCreate, setSelectedUserForCreate] = useState<User | null>(null);
  const [selectedUserForView, setSelectedUserForView] = useState<User | null>(null);
  const [passwords, setPasswords] = useState<any[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const fetchUsers = async () => {
    const res = await userService.getUsers();
    setUsers(res);
  };

  const fetchPasswords = async (userId: number) => {
    const res = await passwordService.getByUser(userId);
    const masked = res.data.map((pw: any) => ({
      ...pw,
      content: "••••••" + pw.content.slice(-4),
      startAt: formatDateForDisplay(pw.startAt),
      endAt: formatDateForDisplay(pw.endAt),
    }));
    setPasswords(masked);
  };

  const handleUserAction = async (action: string, user: User) => {
    if (action === "crear") {
      setSelectedUserForCreate(user);
    }
    if (action === "ver") {
      setSelectedUserForView(user);
      await fetchPasswords(user.id);
    }
  };

  const handlePasswordAction = async (action: string, item: any) => {
    if (action === "delete") {
      await passwordService.delete(item.id);
      if (selectedUserForView) {
        await fetchPasswords(selectedUserForView.id);
      }
    }
  };

  const handleCreate = async () => {
    if (!newPassword.trim()) {
      alert("La contraseña no puede estar vacía");
      return;
    }
    if (startAt >= endAt) {
      alert("La fecha de inicio debe ser menor que la de fin");
      return;
    }
    if (selectedUserForCreate) {
      await passwordService.create(selectedUserForCreate.id, {
        content: newPassword,
        startAt: formatDateForBackend(startAt),
        endAt: formatDateForBackend(endAt),
      });
      setNewPassword("");
      setStartAt("");
      setEndAt("");
      setSelectedUserForCreate(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Contraseñas por Usuario
      </Typography>

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Usuarios
      </Typography>
      <GenericTable
        data={users}
        columns={userColumns}
        actions={userActions}
        onAction={handleUserAction}
            styleType={tableStyle}
      />

      {selectedUserForCreate && (
        <Dialog open onClose={() => setSelectedUserForCreate(null)} fullWidth>
          <DialogTitle>Agregar contraseña a {selectedUserForCreate.name}</DialogTitle>
          <DialogContent>
            <TextField
              label="Contenido"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Inicio"
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Fin"
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedUserForCreate(null)}>Cancelar</Button>
            <Button onClick={handleCreate} variant="contained">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedUserForView && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Historial de contraseñas de {selectedUserForView.name}
          </Typography>
          <GenericTable
            data={passwords}
            columns={passwordColumns}
            actions={passwordActions}
            onAction={handlePasswordAction}
          />
        </>
      )}
    </Box>
  );
};

export default UserPasswordsPage;
