import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Close as CloseIcon,
    Edit as EditIcon,
    Person,
    Email,
    CreditCard,
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
    Divider,
    alpha
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { userUpdateValidationSchema } from "../../validations/UserValidations";
import { updateTeacher } from "../../features/teacherSlice";

const TeacherEditModal = ({ teacher }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const initialValues = {
        id: teacher.id,
        name: teacher.user?.name || "",
        email: teacher.user?.email || "",
        dni: teacher.user?.dni || "",
        role: teacher.user?.role || "TEACHER",
        category: teacher.category || "",
        contractType: teacher.contractType || "",
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const teacherData = {
            id: teacher.id,
            category: values.category,
            contractType: values.contractType,
        };

        try {
            const result = await dispatch(updateTeacher(teacherData));

            if (updateTeacher.fulfilled.match(result)) {
                resetForm();
                closeModal();
            } else {
                console.error("Error al actualizar profesor:", result.error);
            }
        } catch (error) {
            console.error("Excepción al actualizar profesor:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <IconButton
                onClick={openModal}
                color="primary"
                size="medium"
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
                                Editar Profesor
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Actualice la información del profesor seleccionado
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={closeModal}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Formik
                    initialValues={initialValues}
                    validationSchema={userUpdateValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, isSubmitting, errors, touched }) => (
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
                                            slotProps={{
                                                input: {
                                                    readOnly: true,
                                                },
                                            }}
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
                                            slotProps={{
                                                input: {
                                                    readOnly: true,
                                                },
                                            }}
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
                                            slotProps={{
                                                input: {
                                                    readOnly: true,
                                                },
                                            }}
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
                                </Stack>

                                <Divider sx={{ my: 3 }} />

                                {/* Sección de datos del profesor */}
                                <Stack direction={isMobile ? "column" : "row"} spacing={3}>
                                    <Field
                                        as={TextField}
                                        name="category"
                                        label="Categoría"
                                        value={values.category}
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


                                        <MenuItem value={'COMPLETO'}>
                                            COMPLETO
                                        </MenuItem>
                                        <MenuItem value={'MEDIO'}>
                                            MEDIO
                                        </MenuItem>
                                        <MenuItem value={'PARCIAL'}>
                                            PARCIAL
                                        </MenuItem>
                                    </Field>

                                    <Field
                                        as={TextField}
                                        name="contractType"
                                        label="Tipo de contrato"
                                        select
                                        fullWidth
                                        variant="outlined"
                                        value={values.contractType}
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
                                        <MenuItem value={'COMPLETO'}>TIEMPO COMPLETO</MenuItem>
                                        <MenuItem value={'TEMPORAL'}>TEMPORAL</MenuItem>
                                        <MenuItem value={'PRINCIPAL'}>PRINCIPAL</MenuItem>
                                        <MenuItem value={'PERMANENTE'}>PERMANTENTE</MenuItem>
                                        <MenuItem value={'CONTRATISTA'}>CONTRATISTA</MenuItem>
                                    </Field>
                                </Stack>
                            </DialogContent>

                            <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                <Button
                                    onClick={closeModal}
                                    variant="outlined"
                                    size="large"
                                    color="inherit"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                >
                                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default TeacherEditModal;