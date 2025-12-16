import { Formik, Form, Field } from "formik";
import { TextField, Box, Divider, MenuItem, Switch, FormControlLabel, Alert } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { Stack, Typography, Button } from "@mui/material";
import { AddToDrive, Palette, AccessTime } from "@mui/icons-material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAndUpdateSettings, getSettings } from "../../features/settingSlice";
import { useThemeContext } from "../../context/ThemeContext";

const Setting = () => {
    const dispatch = useDispatch();
    const { settings, isSubmitting, error, isLoading } = useSelector((state) => state.setting);
    const { primaryColor, updatePrimaryColor } = useThemeContext();

    useEffect(() => {
        dispatch(getSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings?.themeColor && settings.themeColor !== primaryColor) {
            updatePrimaryColor(settings.themeColor);
        }
    }, [settings?.themeColor]);

    const initialValues = {
        driveLink: settings?.driveLink || "",
        driveLink2: settings?.driveLink2 || "",
        driveLink3: settings?.driveLink3 || "",
        themeColor: primaryColor,
        autoApproveAmount: settings?.autoApproveAmount || 4,
        autoApproveUnit: settings?.autoApproveUnit || "DAYS",
    };

    const handleSubmit = (values) => {
        // Actualizar color en el contexto (localStorage)
        updatePrimaryColor(values.themeColor);
        // Guardar en backend
        dispatch(createAndUpdateSettings({ ...values }));
    };

    const handleColorChange = (e, setFieldValue) => {
        const newColor = e.target.value;
        setFieldValue('themeColor', newColor);
        // Actualizar inmediatamente en el contexto para preview
        updatePrimaryColor(newColor);
    };

    return (
        <div>
            <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
                {({ setFieldValue, values }) => (
                    <Form>
                        <Stack spacing={3}>
                            {/* Sección de Tema */}
                            <Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Configuración de Tema
                                </Typography>

                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <Field
                                        as={TextField}
                                        name="themeColor"
                                        label="Color Principal de la App"
                                        type="color"
                                        fullWidth
                                        variant="filled"
                                        onChange={(e) => handleColorChange(e, setFieldValue)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Palette color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Sección de Aprobación Automática */}
                            <Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Configuración de Aprobación Automática de Conformidades
                                </Typography>

                                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                    <Field
                                        as={TextField}
                                        name="autoApproveAmount"
                                        label="Tiempo para aprobación automática"
                                        type="number"
                                        fullWidth
                                        variant="filled"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccessTime color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Field
                                        as={TextField}
                                        select
                                        name="autoApproveUnit"
                                        label="Unidad de Tiempo"
                                        fullWidth
                                        variant="filled"
                                    >
                                        <MenuItem value="DAYS">Días</MenuItem>
                                        <MenuItem value="HOURS">Horas</MenuItem>
                                        <MenuItem value="MINUTES">Minutos</MenuItem>
                                    </Field>
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Sección de Drive Links */}
                            <Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Enlaces de Google Drive
                                </Typography>

                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <Field
                                        as={TextField}
                                        name="driveLink"
                                        label="Enlace de drive para importar horas COLEGIO"
                                        fullWidth
                                        variant="filled"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AddToDrive color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Field
                                        as={TextField}
                                        name="driveLink2"
                                        label="Enlace de drive para importar horas ACADEMIA"
                                        fullWidth
                                        variant="filled"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AddToDrive color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Field
                                        as={TextField}
                                        name="driveLink3"
                                        label="Enlace de drive para importar DOCENTES"
                                        fullWidth
                                        variant="filled"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AddToDrive color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    {error && <Typography color="error">{error}</Typography>}
                                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} loading={isLoading}>
                                        Guardar
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Setting;