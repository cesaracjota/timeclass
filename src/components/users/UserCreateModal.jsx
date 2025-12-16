import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Close as CloseIcon,
    PersonAdd as PersonAddIcon,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
    Typography,
    useTheme,
    CircularProgress,
    InputAdornment,
    Stack,
    useMediaQuery
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { userCreateValidationSchema } from "../../validations/UserValidations";
import { createUser } from "../../features/userSlice";

const UserCreateModal = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const initialValues = {
        name: "",
        email: "",
        dni: "",
        password: "",
        confirmPassword: "",
        role: "TEACHER",
    };

    const roleOptions = [
        { value: "ADMIN", label: "ADMINISTRADOR" },
        { value: "TEACHER", label: "DOCENTE" },
        { value: "SUPERVISOR", label: "SUPERVISOR" },
    ];

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const userData = { ...values };
        delete userData.confirmPassword;

        try {
            const result = await dispatch(createUser(userData));

            if (createUser.fulfilled.match(result)) {
                resetForm();
                closeModal();
            } else {
                console.error("Error al crear usuario:", result.error);
            }
        } catch (error) {
            console.error("Excepción al crear usuario:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <Button
                fullWidth={isMobile}
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={openModal}
            >
                Nuevo Usuario
            </Button>

            <Dialog
                open={isOpen}
                onClose={closeModal}
                scroll="body"
                fullScreen={isMobile}
                
                slotProps={{
                    paper: {
                        sx: {
                            boxShadow: theme.shadows[12],
                            maxHeight: '85vh',
                            width: '100%',
                            maxWidth: 900,
                            transition: 'transform 0.3s ease-in-out',
                            transform: 'translateY(0)',
                            '&.MuiDialog-scrollBody': {
                                overflow: 'hidden'
                            },
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        py: 2,
                        px: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Box>
                        <Typography fontSize={['1.2rem', '1.5rem']} variant="h5" component="h2" fontWeight={600} gutterBottom>
                            CREAR UN NUEVO USUARIO
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Complete la información para registrar un nuevo usuario en el sistema
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={closeModal}
                        size={'large'}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Formik
                    initialValues={initialValues}
                    validationSchema={userCreateValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form>
                            <DialogContent sx={{ px: 4, py: 3 }} dividers>
                                <Stack gap={2.5} direction={["column", "row", "row"]} sx={{ flexWrap: 'wrap' }}>
                                    <Stack gap={2.5} sx={{ flex: 1, minWidth: isMobile ? '100%' : '280px' }}>
                                        <Field
                                            as={TextField}
                                            name="name"
                                            label="Nombre completo"
                                            variant="outlined"
                                            fullWidth
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />

                                        <Field
                                            as={TextField}
                                            name="email"
                                            label="Correo electrónico"
                                            type="email"
                                            variant="outlined"
                                            fullWidth
                                        />

                                        <Field
                                            as={TextField}
                                            name="dni"
                                            label="Documento de identidad"
                                            variant="outlined"
                                            fullWidth
                                            error={touched.dni && Boolean(errors.dni)}
                                            helperText={touched.dni && errors.dni}
                                        />
                                    </Stack>

                                    <Stack spacing={2.5} sx={{ flex: 1, minWidth: isMobile ? '100%' : '280px' }}>
                                        <Field
                                            as={TextField}
                                            name="role"
                                            label="Rol del usuario"
                                            select
                                            variant="outlined"
                                            fullWidth
                                            error={touched.role && Boolean(errors.role)}
                                            helperText={touched.role && errors.role}
                                            SelectProps={{
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: {
                                                            boxShadow: theme.shadows[8],
                                                            '& .MuiMenuItem-root': {
                                                                py: 1.5,
                                                                mx: 1,
                                                                my: 0.5
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            {roleOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Field>

                                        <Field
                                            as={TextField}
                                            name="password"
                                            label="Contraseña"
                                            type={showPassword ? 'text' : 'password'}
                                            variant="outlined"
                                            fullWidth
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={togglePasswordVisibility}
                                                            edge="end"
                                                            size="small"
                                                            sx={{ color: 'text.secondary' }}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <Field
                                            as={TextField}
                                            name="confirmPassword"
                                            label="Confirmar contraseña"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            variant="outlined"
                                            fullWidth
                                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={toggleConfirmPasswordVisibility}
                                                            edge="end"
                                                            size="small"
                                                            sx={{ color: 'text.secondary' }}
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </DialogContent>

                            <DialogActions sx={{ px: 4, py: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                                <Button
                                    onClick={closeModal}
                                    variant="outlined"
                                    size="large"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    variant="contained"
                                    size="large"
                                >
                                    {isSubmitting ? (
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <CircularProgress size={18} />
                                            <span>Creando...</span>
                                        </Box>
                                    ) : (
                                        "Crear Usuario"
                                    )}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default UserCreateModal;