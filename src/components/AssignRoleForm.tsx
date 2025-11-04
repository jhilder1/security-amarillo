import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { Role } from "../models/Role";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (roleId: number) => void;
  availableRoles: Role[];
}

const AssignRoleForm: React.FC<Props> = ({ open, onClose, onSubmit, availableRoles }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");

  const handleSubmit = () => {
    if (selectedRoleId !== "") {
      onSubmit(Number(selectedRoleId));
      setSelectedRoleId("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Asignar Rol</DialogTitle>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Asignar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignRoleForm;
