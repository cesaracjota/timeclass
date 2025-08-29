import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../features/authSlice';

const UserProfile = () => {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth.user);

    const [formData, setFormData] = useState({
        id: user?.id || '',
        name: user?.name || '',
        dni: user?.dni || '',
        email: user?.email || '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        dispatch(updateProfile(formData));
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h5" fontWeight="bold">
                    Mi Perfil
                </Typography>
                {!isEditing && (
                    <IconButton onClick={() => setIsEditing(true)}>
                        <Edit />
                    </IconButton>
                )}
            </Box>

            <Stack spacing={2}>
                <TextField
                    label="Nombre completo"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    disabled={!isEditing}
                />
                <TextField
                    label="DNI"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    fullWidth
                    disabled={!isEditing}
                />
                <TextField
                    label="Correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    fullWidth
                    disabled={!isEditing}
                />

                {isEditing && (
                    <TextField
                        label="Nueva contraseña"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            </Stack>

            {isEditing && (
                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Guardar Cambios
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default UserProfile;