import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // 👈 Importa useNavigate

const LoginPage = () => {
  const { loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate(); // 👈 Inicializa el hook

  const handleLogin = async () => {
    await loginWithGoogle();     // 👈 Inicia sesión
    navigate("/");               // 👈 Redirige al Dashboard
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Sistema de Seguridad
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Iniciar sesión con Google
      </Button>
    </Container>
  );
};

export default LoginPage;
