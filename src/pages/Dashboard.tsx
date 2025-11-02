import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Typography, Avatar, Button } from "@mui/material";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
      <Avatar src={user?.photo} sx={{ width: 96, height: 96, margin: "auto" }} />
      <Typography variant="h5" gutterBottom>
        ¡Hola, {user?.name}!
      </Typography>
      <Typography variant="body1">{user?.email}</Typography>
      <Button variant="outlined" color="secondary" sx={{ mt: 2 }} onClick={logout}>
        Cerrar sesión
      </Button>
    </Container>
  );
};

export default Dashboard;
