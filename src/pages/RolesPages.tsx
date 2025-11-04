import { useEffect, useState } from "react";
import { Role } from "../models/Role";
import { roleService } from "../services/roleService";
import GenericTable from "../components/GenericTable";
import RoleForm from "../components/RoleForm";
import { useOutletContext } from "react-router-dom";



const RolesPage = () => {
    const { tableStyle } = useOutletContext<{ tableStyle: "material" | "bootstrap" | "tailwind" }>();
  const [roles, setRoles] = useState<Role[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const fetchRoles = async () => {
    const response = await roleService.getAll();
    setRoles(response.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAction = (action: string, role: Role) => {
    if (action === "edit") {
      setSelectedRole(role);
      setOpenForm(true);
    }
    if (action === "delete") {
      roleService.delete(role.id).then(fetchRoles);
    }
  };

  const handleSubmit = async (data: Omit<Role, "id">) => {
    if (selectedRole) {
      await roleService.update(selectedRole.id, data);
    } else {
      await roleService.create(data);
    }
    setOpenForm(false);
    setSelectedRole(null);
    fetchRoles();
  };

  return (
    <>
      <h2>Gestión de Roles</h2>
      <button onClick={() => { setSelectedRole(null); setOpenForm(true); }}>
        Crear nuevo rol
      </button>
      <GenericTable
        data={roles}
        columns={["id", "name", "description"]}
        actions={[
          { name: "edit", label: "Editar" },
          { name: "delete", label: "Eliminar", color: "error" },
        ]}
        onAction={handleAction}
         styleType={tableStyle}
      />
      <RoleForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        initialData={selectedRole}
      />
    </>
  );
};

export default RolesPage;
