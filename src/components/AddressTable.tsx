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
import { addressService } from "../services/AddressService";
import GenericTable from "../components/GenericTable";
import { User } from "../models/User";
import { useOutletContext } from "react-router-dom";
import LocationPickerMap from "../components/LocationPickerMap"; // ✅ agregado

const userColumns = ["id", "name", "email"];
const addressColumns = ["id", "street", "number", "latitude", "longitude"];

const userActions = [
  { name: "crear", label: "Crear dirección", color: "success" },
  { name: "ver", label: "Ver dirección", color: "primary" },
];

const addressActions = [
  { name: "edit", label: "Editar", color: "primary" },
  { name: "delete", label: "Eliminar", color: "error" },
];

const UserAddressesPage = () => {
  const { tableStyle } = useOutletContext<{ tableStyle: "material" | "bootstrap" | "tailwind" }>();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserForAddress, setSelectedUserForAddress] = useState<User | null>(null);
  const [selectedUserForView, setSelectedUserForView] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: undefined,
    street: "",
    number: "",
    latitude: "",
    longitude: "",
  });

  const fetchUsers = async () => {
    const res = await userService.getUsers();
    setUsers(res);
  };

  const fetchAddress = async (userId: number) => {
    try {
      const res = await addressService.getByUser(userId);
      setAddresses(res.data ? [res.data] : []);
    } catch {
      setAddresses([]);
    }
  };

  const handleUserAction = async (action: string, user: User) => {
    if (action === "crear") {
      try {
        const res = await addressService.getByUser(user.id);
        if (res.data?.id) {
          alert(`El usuario ${user.name} ya tiene una dirección asociada.`);
          return;
        }
      } catch {}

      setSelectedUserForAddress(user);
      setForm({
        id: undefined,
        street: "",
        number: "",
        latitude: "0",
        longitude: "0",
      });
    }

    if (action === "ver") {
      setSelectedUserForView(user);
      await fetchAddress(user.id);
    }
  };

  const handleAddressAction = async (action: string, item: any) => {
    if (action === "edit") {
      setSelectedUserForAddress({ id: item.user_id, name: "", email: "" } as User);
      setForm({
        id: item.id,
        street: item.street || "",
        number: item.number || "",
        latitude: String(item.latitude || "0"),
        longitude: String(item.longitude || "0"),
      });
    }

    if (action === "delete") {
      await addressService.delete(item.id);
      if (selectedUserForView) {
        await fetchAddress(selectedUserForView.id);
      }
    }
  };

  const handleSave = async () => {
    if (!form.street || !form.number || !form.latitude || !form.longitude) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const payload = {
      street: form.street,
      number: form.number,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    };

    try {
      if (form.id) {
        await addressService.update(form.id, payload);
      } else if (selectedUserForAddress) {
        await addressService.create(selectedUserForAddress.id, payload);
      }
      setSelectedUserForAddress(null);

      if (selectedUserForView?.id === selectedUserForAddress?.id) {
        await fetchAddress(selectedUserForView.id);
      }
    } catch (error: any) {
      console.error("Error al guardar dirección:", error);
      alert("Error al guardar dirección. Verifica los datos o la conexión.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Direcciones por Usuario
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

      {selectedUserForAddress && (
        <Dialog open onClose={() => setSelectedUserForAddress(null)} fullWidth>
          <DialogTitle>
            {form.id
              ? `Editar dirección #${form.id}`
              : `Agregar dirección a ${selectedUserForAddress.name}`}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Calle"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Número"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Latitud"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Longitud"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              fullWidth
              margin="dense"
            />

            {/* ✅ Mapa interactivo */}
            <LocationPickerMap
              latitude={parseFloat(form.latitude) || 0}
              longitude={parseFloat(form.longitude) || 0}
              onSelect={(lat, lng) =>
                setForm({
                  ...form,
                  latitude: String(lat),
                  longitude: String(lng),
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedUserForAddress(null)}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedUserForView && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Dirección de {selectedUserForView.name}
          </Typography>
          <GenericTable
            data={addresses}
            columns={addressColumns}
            actions={addressActions}
            onAction={handleAddressAction}
          />
        </>
      )}
    </Box>
  );
};

export default UserAddressesPage;
