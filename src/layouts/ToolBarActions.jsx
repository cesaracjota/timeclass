import React from 'react';
import {
    Avatar,
    Box,
    IconButton,
    Divider,
    Tooltip,
    Chip,
    ListItemIcon,
    ListItemText,
    Drawer,
    List,
    ListItemButton,
    Typography,
    Stack
} from '@mui/material';

import { Logout, AccountCircleOutlined, LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router';
import { useColorScheme } from '@mui/material/styles';


export default function ToolbarActions() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { mode, setMode } = useColorScheme();
    const fullName = user?.user?.name || null;
    const email = user?.user?.email || null;
    const role = user?.user?.role || null;

    const handleThemeChange = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        // Guardar en localStorage para persistencia
        localStorage.setItem('themeMode', newMode);
    };

    const toggleDrawer = (open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogout = () => {
        dispatch(logout());
        setDrawerOpen(false);
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'ADMINISTRADOR';
            case 'SECRETARY':
                return 'SECRETARIA';
            case 'SUPERVISOR':
                return 'SUPERVISOR';
            case 'TEACHER':
                return 'DOCENTE';
            default:
                return 'INVITADO';
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleThemeChange} color="inherit">
                {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>

            <Tooltip title="Menú de usuario">
                <IconButton onClick={toggleDrawer(true)} variant="soft" size="small" color="inherit">
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: 'primary.main',
                            color: 'common.white',
                            fontWeight: 600
                        }}
                        alt={fullName}
                    >
                        {fullName.charAt(0)}
                    </Avatar>
                </IconButton>
            </Tooltip>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    zIndex: 1400,
                }}
                PaperProps={{
                    sx: {
                        width: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 3,
                    },
                }}
            >
                {/* Header del drawer */}
                <Box sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                bgcolor: 'primary.main',
                                color: 'common.white',
                                fontSize: 32,
                                fontWeight: 'bold',
                                boxShadow: 2,
                            }}
                        >
                            {fullName.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="semibold">
                                {fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {email}
                            </Typography>
                            <Chip
                                label={getRoleLabel(role)}
                                size="small"
                                color="primary"
                                sx={{
                                    mt: 1,
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    borderRadius: 1,
                                }}
                            />
                        </Box>
                    </Stack>
                </Box>

                <Divider />

                {/* Menú */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2 }}>
                    <List>
                        <ListItemButton
                            sx={{
                                borderRadius: 2,
                            }}
                            onClick={() => {
                                setDrawerOpen(false);
                                navigate('/profile');
                            }}
                        >
                            <ListItemIcon>
                                <AccountCircleOutlined />
                            </ListItemIcon>
                            <ListItemText primary="MI PERFIL" sx={{ fontSize: 14 }} />
                        </ListItemButton>
                    </List>
                </Box>

                <Divider />

                {/* Footer */}
                <Box sx={{ px: 2, py: 1 }}>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            color: 'error.main',
                            borderRadius: 2,
                        }}
                    >
                        <ListItemIcon>
                            <Logout sx={{ color: 'error.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="CERRAR SESIÓN" sx={{ fontSize: 14 }} />
                    </ListItemButton>
                    <Typography
                        variant="caption"
                        sx={{ mt: 1, display: 'block', color: 'text.secondary', textAlign: 'center' }}
                    >
                        v1.0.0 • © 2025
                    </Typography>
                </Box>
            </Drawer>
        </Box>
    );
}