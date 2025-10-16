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
    Stack,
    Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { Logout, AccountCircleOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router';
import { useColorScheme } from '@mui/material/styles';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

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
            <MaterialUISwitch 
                checked={mode === 'dark'} 
                onChange={handleThemeChange}
            />

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