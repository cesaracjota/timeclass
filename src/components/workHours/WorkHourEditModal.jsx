import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, Stack, Typography, Avatar,
    MenuItem,
    AvatarGroup,
    Box,
} from "@mui/material";
import { Edit, Close as CloseIcon } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateWorkHour } from "../../features/workHourSlice";
import moment from "moment";

const schema = Yup.object({
    teacherId: Yup.string().required("Profesor requerido"),
    semana: Yup.number().required("Semana requerida"),
    dia: Yup.string().required("Día requerido"),
    fecha: Yup.string().required("Fecha requerida"),
    turno: Yup.string().required("Turno requerido"),
    local: Yup.string().required("Local requerido"),
});

const weeks = [
    { value: 1, label: 'SEMANA 1' },
    { value: 2, label: 'SEMANA 2' },
    { value: 3, label: 'SEMANA 3' },
    { value: 4, label: 'SEMANA 4' },
    { value: 5, label: 'SEMANA 5' },
];

const days = [
    { value: 'LUNES', label: 'LUNES' },
    { value: 'MARTES', label: 'MARTES' },
    { value: 'MIÉRCOLES', label: 'MIÉRCOLES' },
    { value: 'JUEVES', label: 'JUEVES' },
    { value: 'VIERNES', label: 'VIERNES' },
    { value: 'SÁBADO', label: 'SÁBADO' },
    { value: 'DOMINGO', label: 'DOMINGO' },
];

const WorkHourEditModal = ({ data }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { user } = useSelector((state) => state.auth.user);

    const initialValues = {
        teacherId: data.teacherId,
        semana: data.semana,
        dia: data.dia,
        fecha: moment(data.fecha).format("YYYY-MM-DD"),
        turno: data.turno,
        local: data.local,
        grupo: data.grupo,
        curso: data.curso,
        ingreso: data.ingreso,
        salida: data.salida,
        horasFijas: data.horasFijas,
        tardanza: data.tardanza,
        horasDictadas: data.horasDictadas,
        tipo: data.tipo,
        observaciones: data.observaciones,
        estado: data.estado,
    };
    const handleSubmit = async (values, actions) => {
        try {
            await dispatch(updateWorkHour(
                {
                    id: data.id,
                    data: values
                }
            ));
            actions.setSubmitting(false);
            handleClose();
        } catch (error) {
            console.error("Error al editar:", error);
            actions.setSubmitting(false);
        }
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                color="primary"
                size="medium"
                disabled={user?.role === "SUPERVISOR"}
            >
                <Edit fontSize="medium" />
            </IconButton>

            <Dialog open={open} onClose={handleClose} fullScreen scroll="body">
                <DialogTitle sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e0e0e0',
                    px: 3,
                    py: 2,
                }}>
                    <span style={{ alignSelf: "center" }}>Editar Horas de Trabajo</span>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>


                <Formik
                    initialValues={initialValues}
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <DialogContent dividers>
                                <Stack spacing={2} direction="column" justifyContent="center">
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, alignSelf: "center" }}>
                                        <AvatarGroup sx={{ display: "flex", alignItems: "center", gap: 1, alignSelf: "center" }}>
                                            <Avatar sx={{ width: 40, height: 40 }} color="primary">
                                                {data.teacher.user.name.charAt(0)}
                                            </Avatar>
                                            <Typography variant="body1">{data.teacher.user.name}</Typography>
                                        </AvatarGroup>
                                    </Box>
                                    <Stack direction={["column", "column", "row"]} gap={2}>
                                        <Field name="fecha" label="Fecha" as={TextField} type="date" fullWidth error={touched.fecha && !!errors.fecha} helperText={touched.fecha && errors.fecha} />
                                        <Field
                                            as={TextField}
                                            name="semana"
                                            label="Semana"
                                            select
                                            fullWidth
                                            error={touched.semana && !!errors.semana}
                                            helperText={touched.semana && errors.semana}
                                        >
                                            {weeks.map((week) => (
                                                <MenuItem key={week.value} value={week.value}>
                                                    {week.label}
                                                </MenuItem>
                                            ))}
                                        </Field>

                                        <Field
                                            as={TextField}
                                            name="dia"
                                            label="Día"
                                            select
                                            fullWidth
                                            error={touched.dia && !!errors.dia}
                                            helperText={touched.dia && errors.dia}
                                        >
                                            {days.map((day) => (
                                                <MenuItem key={day.value} value={day.value}>
                                                    {day.label}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Stack>
                                    <Stack direction={["column", "column", "row"]} gap={2}>
                                        <Field name="turno" as={TextField} label="Turno" fullWidth error={touched.turno && !!errors.turno} helperText={touched.turno && errors.turno} />
                                        <Field name="local" as={TextField} label="Local" fullWidth error={touched.local && !!errors.local} helperText={touched.local && errors.local} />
                                    </Stack>
                                    <Stack direction={["column", "column", "row"]} gap={2}>
                                        <Field name="grupo" as={TextField} label="Grupo" fullWidth error={touched.grupo && !!errors.grupo} helperText={touched.grupo && errors.grupo} />
                                        <Field name="curso" as={TextField} label="Curso" fullWidth error={touched.curso && !!errors.curso} helperText={touched.curso && errors.curso} />
                                    </Stack>
                                    <Stack direction={["column", "column", "row"]} gap={2}>
                                        <Field name="ingreso" label="Hora de Ingreso" as={TextField} type="time" fullWidth error={touched.ingreso && !!errors.ingreso} helperText={touched.ingreso && errors.ingreso} />
                                        <Field name="salida" label="Hora de Salida" as={TextField} type="time" fullWidth error={touched.salida && !!errors.salida} helperText={touched.salida && errors.salida} />
                                    </Stack>
                                    <Stack direction={["column", "column", "row"]} gap={2}>
                                        <Field
                                            as={TextField}
                                            name="horasFijas"
                                            label="Horas Fijas"
                                            type="time"
                                            fullWidth
                                            error={touched.horasFijas && !!errors.horasFijas}
                                            helperText={touched.horasFijas && errors.horasFijas}
                                        />
                                        <Field
                                            as={TextField}
                                            name="tardanza"
                                            label="Tardanza"
                                            type="time"
                                            fullWidth
                                            error={touched.tardanza && !!errors.tardanza}
                                            helperText={touched.tardanza && errors.tardanza}
                                        />
                                        <Field name="horasDictadas" as={TextField} label="Horas Dictadas" type="time" fullWidth error={touched.horasDictadas && !!errors.horasDictadas} helperText={touched.horasDictadas && errors.horasDictadas} />
                                    </Stack>
                                    <Stack direction={["column", "column", "row"]} gap={2}>
                                        <Field
                                            as={TextField}
                                            name="tipo"
                                            label="Tipo"
                                            select
                                            fullWidth
                                            error={touched.tipo && !!errors.tipo}
                                            helperText={touched.tipo && errors.tipo}
                                        >
                                            <MenuItem value="COLEGIO">COLEGIO</MenuItem>
                                            <MenuItem value="ACADEMIA">ACADEMIA</MenuItem>
                                        </Field>
                                        <Field
                                            as={TextField}
                                            name="estado"
                                            label="Estado"
                                            select
                                            fullWidth
                                            error={touched.estado && !!errors.estado}
                                            helperText={touched.estado && errors.estado}
                                        >
                                            <MenuItem value="PENDING">PENDIENTE</MenuItem>
                                            <MenuItem value="REJECTED">INCONFORME</MenuItem>
                                            <MenuItem value="ACCEPTED">CONFORME</MenuItem>
                                        </Field>
                                    </Stack>
                                    <Field
                                        as={TextField}
                                        name="observaciones"
                                        label="Observaciones"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        error={touched.observaciones && !!errors.observaciones}
                                        helperText={touched.observaciones && errors.observaciones}
                                    />

                                </Stack>
                            </DialogContent>
                            <DialogActions sx={{
                                position: 'sticky',
                                bottom: 0,
                                zIndex: 1000,
                                backgroundColor: 'background.paper',
                                px: 3,
                                py: 2,
                                borderTop: '1px solid #e0e0e0',
                            }}>
                                <Button onClick={handleClose} variant="outlined" size="large">Cancelar</Button>
                                <Button type="submit" color="primary" size="large" variant="contained" disabled={isSubmitting}>
                                    ACTUALIZAR
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default WorkHourEditModal;