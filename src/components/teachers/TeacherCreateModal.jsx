import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Close as CloseIcon,
    PersonAdd as PersonAddIcon,
    Visibility,
    VisibilityOff,
    Person,
    Email,
    CreditCard,
    Lock,
    Security,
    School,
    Work
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
    useMediaQuery,
    Divider
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { userCreateValidationSchema } from "../../validations/UserValidations";
import { createTeacher } from "../../features/teacherSlice";

const TeacherCreateModal = () => {
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
        category: "",
        contractType: "",
    };

    const roleOptions = [
        { value: "ADMIN", label: "Administrador" },
        { value: "TEACHER", label: "Profesor" },
        { value: "SECRETARY", label: "Secretario" },
    ];

    const categoryOptions = [
        { value: "PRINCIPAL", label: "Principal" },
        { value: "ASSOCIATE", label: "Asociado" },
        { value: "ASSISTANT", label: "Asistente" },
    ];

    const contractOptions = [
        { value: "FULL_TIME", label: "Tiempo completo" },
        { value: "PART_TIME", label: "Medio tiempo" },
        { value: "TEMPORARY", label: "Temporal" },
    ];

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const teacherData = { ...values };
        delete teacherData.confirmPassword;

        try {
            const result = await dispatch(createTeacher(teacherData));

            if (createTeacher.fulfilled.match(result)) {
                resetForm();
                closeModal();
            } else {
                console.error("Error al crear profesor:", result.error);
            }
        } catch (error) {
            console.error("Excepción al crear profesor:", error);
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
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={openModal}
                fullWidth={isMobile}
            >
                Nuevo Profesor
            </Button>

            <Dialog
                open={isOpen}
                onClose={closeModal}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
                scroll="body"
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 2,
                        px: 3,
                        borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                Crear Nuevo Profesor
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Complete la información para registrar un nuevo profesor
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={closeModal}>
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
                            <DialogContent dividers sx={{ p: 3 }}>
                                <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                                    {/* Columna izquierda - Información personal */}
                                    <Stack spacing={2} sx={{ flex: 1 }}>
                                        <Box display="flex" alignItems="center">
                                            <CreditCard color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle1">Información Personal</Typography>
                                        </Box>

                                        <Field
                                            as={TextField}
                                            name="name"
                                            label="Nombre completo"
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />

                                        <Field
                                            as={TextField}
                                            name="email"
                                            label="Correo electrónico"
                                            type="email"
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                        />

                                        <Field
                                            as={TextField}
                                            name="dni"
                                            label="Documento de identidad"
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CreditCard fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={touched.dni && Boolean(errors.dni)}
                                            helperText={touched.dni && errors.dni}
                                        />
                                    </Stack>

                                    {/* Columna derecha - Credenciales */}
                                    <Stack spacing={2} sx={{ flex: 1 }}>
                                        <Box display="flex" alignItems="center">
                                            <Security color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle1">Credenciales</Typography>
                                        </Box>

                                        <Field
                                            as={TextField}
                                            name="password"
                                            label="Contraseña"
                                            type={showPassword ? 'text' : 'password'}
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={togglePasswordVisibility}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                        />

                                        <Field
                                            as={TextField}
                                            name="confirmPassword"
                                            label="Confirmar contraseña"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={toggleConfirmPasswordVisibility}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
                                        />

                                        <Field
                                            as={TextField}
                                            name="role"
                                            label="Rol"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Security fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={touched.role && Boolean(errors.role)}
                                            helperText={touched.role && errors.role}
                                        >
                                            {roleOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Stack>
                                </Stack>

                                <Divider sx={{ my: 3 }} />

                                {/* Sección de datos del profesor */}
                                <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                                    <Stack spacing={2} sx={{ flex: 1 }}>
                                        <Box display="flex" alignItems="center">
                                            <School color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle1">Datos del Profesor</Typography>
                                        </Box>

                                        <Field
                                            as={TextField}
                                            name="category"
                                            label="Categoría"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <School fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={touched.category && Boolean(errors.category)}
                                            helperText={touched.category && errors.category}
                                        >
                                            {categoryOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Field>

                                        <Field
                                            as={TextField}
                                            name="contractType"
                                            label="Tipo de contrato"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Work fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={touched.contractType && Boolean(errors.contractType)}
                                            helperText={touched.contractType && errors.contractType}
                                        >
                                            {contractOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Stack>
                                    <Box sx={{ flex: 1 }} /> {/* Espacio vacío para alinear */}
                                </Stack>
                            </DialogContent>

                            <DialogActions sx={{ px: 3, py: 3 }}>
                                <Button
                                    onClick={closeModal}
                                    variant="outlined"
                                    size="large"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                    size="large"
                                >
                                    {isSubmitting ? "Creando..." : "Crear Profesor"}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default TeacherCreateModal;