import React from "react";
import { useNavigate } from "react-router";
import {
    Box,
    Typography,
    Button,
    Paper,
    useTheme,
    Stack,
} from "@mui/material";
import LockPersonRoundedIcon from "@mui/icons-material/LockPersonRounded";

export const AccessDenied = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                alignContent: "center",
                alignSelf: "center",
                justifyItems: "center",
                justifyContent: "center",
                display: "flex",
                textAlign: "center",
            }}
        >
            <Stack spacing={4} alignItems="center">
                {/* Icono de acceso denegado */}
                <Box
                    sx={{
                        bgcolor:
                            theme.palette.mode === "dark"
                                ? theme.palette.error.dark
                                : theme.palette.error.light,
                        borderRadius: "50%",
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        height: 120,
                        boxShadow: 4,
                    }}
                >
                    <LockPersonRoundedIcon
                        sx={{ fontSize: 60, color: theme.palette.error.main }}
                    />
                </Box>

                {/* Texto */}
                <Box>
                    <Typography variant="h2" fontWeight="bold" color="text.primary">
                        403
                    </Typography>
                    <Typography variant="h5" color="text.secondary" mt={1}>
                        Acceso denegado
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mt={2}>
                        No tienes permiso para acceder a esta sección. Si crees que esto es
                        un error, contacta con el administrador.
                    </Typography>
                </Box>

                {/* Botón */}
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/")}
                    startIcon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    }
                >
                    Volver al inicio
                </Button>
            </Stack>
        </Paper>
    );
};
