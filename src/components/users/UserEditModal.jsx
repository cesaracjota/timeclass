import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Close as CloseIcon,
    Edit as EditIcon,
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
    Fade,
    CircularProgress,
    InputAdornment,
    Stack,
    useMediaQuery,
    alpha,
    Switch
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { userUpdateValidationSchema } from "../../validations/UserValidations";
import { updateUser } from "../../features/userSlice";

const UserEditModal = ({ user }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const initialValues = {
        id: user.id,
        name: user.name,
        email: user.email,
        dni: user.dni,
        role: user.role,
        password: "",
        confirmPassword: "",
        active: user.active
    };

    const roleOptions = [
        { value: "ADMIN", label: "ADMINISTRADOR" },
        { value: "TEACHER", label: "DOCENTE" },
        { value: "SECRETARY", label: "SECRETARIA" },
        { value: "SUPERVISOR", label: "SUPERVISOR" },
    ];

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const userData = { ...values };

        // Si no se proporcionó contraseña, eliminamos los campos relacionados
        if (!userData.password) {
            delete userData.password;
            delete userData.confirmPassword;
        } else {
            // Si se proporcionó contraseña, eliminamos solo el campo de confirmación
            delete userData.confirmPassword;
        }

        try {
            const result = await dispatch(updateUser(userData));

            if (updateUser.fulfilled.match(result)) {
                resetForm();
                closeModal();
            } else {
                console.error("Error al actualizar usuario:", result.error);
            }
        } catch (error) {
            console.error("Excepción al actualizar usuario:", error);
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
            <IconButton
                onClick={openModal}
                size="medium"
                color="primary"
                sx={{
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                }}
            >
                <EditIcon fontSize="medium" />
            </IconButton>

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
                            maxWidth: 900
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
                            Editar Usuario
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Actualice la información del usuario seleccionado
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
                    validationSchema={userUpdateValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched, values }) => (
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
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
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
                                            label="Nueva contraseña"
                                            type={showPassword ? 'text' : 'password'}
                                            variant="outlined"
                                            fullWidth
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                            placeholder="Dejar en blanco para no cambiar"
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
                                            label="Confirmar nueva contraseña"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            variant="outlined"
                                            fullWidth
                                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                            placeholder="Dejar en blanco para no cambiar"
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', backgroundColor: 'background.paper', mt: 2, borderRadius: '999px', p: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Habilitar o deshabilitar el usuario
                                    </Typography>
                                    <Field
                                        as={Switch}
                                        name="active"
                                        checked={values.active}
                                    />
                                </Box>
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
                                            <span>Guardando...</span>
                                        </Box>
                                    ) : (
                                        "Guardar Cambios"
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

export default UserEditModal;