import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Role } from "../models/Role";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Role, "id">) => void;
  initialData?: Role | null;
}

const RoleForm: React.FC<Props> = ({ open, onClose, onSubmit, initialData }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es obligatorio"),
      description: Yup.string().required("La descripción es obligatoria"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
      onClose();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (initialData) {
      formik.setValues({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{initialData ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Descripción"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {initialData ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RoleForm;
