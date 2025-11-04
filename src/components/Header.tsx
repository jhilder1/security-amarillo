import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface HeaderProps {
  drawerWidth: number;
  sidebarOpen: boolean;
  toggleDrawer: () => void;
  tableStyle: "material" | "bootstrap" | "tailwind";
  setTableStyle: (style: "material" | "bootstrap" | "tailwind") => void;
}

const Header: React.FC<HeaderProps> = ({
  drawerWidth,
  sidebarOpen,
  toggleDrawer,
  tableStyle,
  setTableStyle,
}) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
        ml: sidebarOpen ? `${drawerWidth}px` : 0,
        transition: "width 0.3s",
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Sistema de Seguridad
        </Typography>

        {/* Menú de estilos de tabla */}
        <Box sx={{ minWidth: 150 }}>
          <Select
            value={tableStyle}
            onChange={(e) => setTableStyle(e.target.value as any)}
            size="small"
            sx={{
              color: "white",
              borderColor: "white",
              "& .MuiSelect-icon": { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            }}
          >
            <MenuItem value="material">Material UI</MenuItem>
            <MenuItem value="bootstrap">Bootstrap</MenuItem>
            <MenuItem value="tailwind">Tailwind</MenuItem>
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
