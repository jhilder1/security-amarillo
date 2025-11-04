import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const drawerWidth = 240;

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tableStyle, setTableStyle] = useState<"material" | "bootstrap" | "tailwind">("material");

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        drawerWidth={drawerWidth}
        toggleDrawer={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: sidebarOpen ? `${drawerWidth}px` : 0,
          transition: "margin 0.3s",
        }}
      >
        {/* Header con menú de estilo */}
        <Header
          drawerWidth={drawerWidth}
          sidebarOpen={sidebarOpen}
          toggleDrawer={() => setSidebarOpen(!sidebarOpen)}
          tableStyle={tableStyle}
          setTableStyle={setTableStyle}
        />

        <Toolbar />

        {/* Routed Content con contexto */}
        <Box sx={{ mt: 2 }}>
          <Outlet context={{ tableStyle }} />
        </Box>
      </Box>
    </Box>
  );
};

export default DefaultLayout;
