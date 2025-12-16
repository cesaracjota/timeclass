import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { BuildCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router';

export const MaintenancePage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    textAlign: 'center',
                    gap: 3,
                }}
            >
                <BuildCircle sx={{ fontSize: 120, color: 'text.secondary', opacity: 0.5 }} />

                <Typography variant="h3" component="h1" fontWeight="bold">
                    En Mantenimiento
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
                    Estamos realizando mejoras en el sistema. Por favor, vuelva a intentarlo más tarde.
                    Disculpe las molestias ocasionadas.
                </Typography>

                <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2 }}
                >
                    Recargar Página
                </Button>
            </Box>
        </Container>
    );
};
