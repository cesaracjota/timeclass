import React from "react";
import { Box, IconButton, Typography, Avatar, Tooltip, Badge } from "@mui/joy";
import { 
  Menu as MenuIcon, 
  Sun, 
  Moon, 
  Bell, 
  Search,
  Settings,
  LogOut
} from "lucide-react";

const Header = ({ 
  darkMode, 
  toggleDarkMode, 
  toggleSidebar, 
  isMobile, 
  sidebarCollapsed, 
  sidebarOpen 
}) => {
  const handleNotificationClick = () => {
    // Handle notification click
    console.log("Notifications clicked");
  };

  const handleProfileClick = () => {
    // Handle profile click
    console.log("Profile clicked");
  };

  const handleSearchClick = () => {
    // Handle search click
    console.log("Search clicked");
  };

  return (
    <Box
      component="header"
      sx={{
        height: 64,
        display: "flex",
        alignItems: "center",
        px: { xs: 2, sm: 3 },
        bgcolor: "background.surface",
        borderBottom: "1px solid",
        borderColor: "divider",
        flexShrink: 0,
        width: "100%",
        boxShadow: "sm",
        position: "relative",
        zIndex: isMobile ? 1100 : "auto",
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title={isMobile ? (sidebarOpen ? "Cerrar menú" : "Abrir menú") : (sidebarCollapsed ? "Expandir sidebar" : "Contraer sidebar")}>
          <IconButton 
            onClick={toggleSidebar} 
            variant="soft" 
            size="sm" 
            aria-label="Toggle sidebar"
            sx={{
              borderRadius: "sm",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              }
            }}
          >
            <MenuIcon size={20} />
          </IconButton>
        </Tooltip>

        {/* Logo/Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "sm",
              bgcolor: "primary.500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "sm",
            }}
          >
            A
          </Box>
          <Typography 
            level="title-lg" 
            sx={{ 
              fontWeight: 600,
              display: { xs: "none", sm: "block" },
              color: "text.primary"
            }}
          >
            Admin Panel
          </Typography>
        </Box>
      </Box>

      {/* Center Section - Search (Desktop only) */}
      {!isMobile && (
        <Box 
          sx={{ 
            flex: 1, 
            display: "flex", 
            justifyContent: "center",
            px: 4
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 400,
            }}
          >
            <IconButton
              variant="soft"
              color="neutral"
              size="sm"
              onClick={handleSearchClick}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
                minHeight: 28,
                minWidth: 28,
              }}
            >
              <Search size={16} />
            </IconButton>
            <Box
              component="input"
              placeholder="Buscar..."
              sx={{
                width: "100%",
                pl: 5,
                pr: 2,
                py: 1,
                fontSize: "sm",
                border: "1px solid",
                borderColor: "neutral.300",
                borderRadius: "sm",
                bgcolor: "background.level1",
                color: "text.primary",
                "&:focus": {
                  outline: "none",
                  borderColor: "primary.500",
                  boxShadow: "0 0 0 3px rgba(var(--joy-palette-primary-mainChannel) / 0.1)",
                },
                "&::placeholder": {
                  color: "text.tertiary",
                },
              }}
            />
          </Box>
        </Box>
      )}

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Mobile Search */}
        {isMobile && (
          <Tooltip title="Buscar">
            <IconButton 
              variant="soft" 
              color="neutral" 
              size="sm"
              onClick={handleSearchClick}
              sx={{ borderRadius: "sm" }}
            >
              <Search size={18} />
            </IconButton>
          </Tooltip>
        )}

        {/* Notifications */}
        <Tooltip title="Notificaciones">
          <IconButton 
            variant="soft" 
            color="neutral" 
            size="sm"
            onClick={handleNotificationClick}
            sx={{ borderRadius: "sm", position: "relative" }}
          >
            <Badge
              badgeContent={3}
              color="danger"
              size="sm"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.75rem",
                  height: 16,
                  minWidth: 16,
                }
              }}
            >
              <Bell size={18} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip title={darkMode ? "Modo claro" : "Modo oscuro"}>
          <IconButton 
            onClick={toggleDarkMode} 
            variant="soft" 
            color="neutral" 
            size="sm"
            sx={{
              borderRadius: "sm",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "rotate(180deg)",
              }
            }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
        </Tooltip>

        {/* Settings */}
        <Tooltip title="Configuraciones">
          <IconButton 
            variant="soft" 
            color="neutral" 
            size="sm"
            sx={{ borderRadius: "sm", display: { xs: "none", sm: "flex" } }}
          >
            <Settings size={18} />
          </IconButton>
        </Tooltip>

        {/* Profile */}
        <Tooltip title="Perfil de usuario">
          <IconButton
            variant="soft"
            color="neutral"
            size="sm"
            onClick={handleProfileClick}
            sx={{ 
              borderRadius: "sm",
              "&:hover": {
                transform: "scale(1.05)",
              }
            }}
          >
            <Avatar 
              size="sm" 
              sx={{ 
                width: 28, 
                height: 28,
                bgcolor: "primary.500",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              JD
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Logout (Desktop only) */}
        <Tooltip title="Cerrar sesión">
          <IconButton 
            variant="soft" 
            color="danger" 
            size="sm"
            sx={{ 
              borderRadius: "sm", 
              display: { xs: "none", md: "flex" },
              ml: 1
            }}
          >
            <LogOut size={18} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Header;