import React, { useEffect, useState, useCallback } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, Stack, Autocomplete, CircularProgress,
    useMediaQuery,
    useTheme,
    MenuItem
} from "@mui/material";
import { Add, Close as CloseIcon } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { searchTeacher } from "../../features/teacherSlice"; // Asegúrate de que retorna la data correctamente
import debounce from "lodash.debounce";
import { createWorkHour } from "../../features/workHourSlice";

const schema = Yup.object({
    teacherId: Yup.string().required("Debe seleccionar un docente"),
    semana: Yup.string().required("Semana requerida"),
    dia: Yup.string().required("Día requerido"),
    fecha: Yup.string().required("Fecha requerida"),
});

const weeks = [
    { value: 1, label: 'SEMANA 1' },
    { value: 2, label: 'SEMANA 2' },
    { value: 3, label: 'SEMANA 3' },
    { value: 4, label: 'SEMANA 4' },
];

const days = [
    { value: 'LUNES', label: 'lunes' },
    { value: 'MARTES', label: 'martes' },
    { value: 'MIERCOLES', label: 'miercoles' },
    { value: 'JUEVES', label: 'jueves' },
    { value: 'VIERNES', label: 'viernes' },
    { value: 'SABADO', label: 'sabado' },
    { value: 'DOMINGO', label: 'domingo' },
];

const WorkHourCreateModal = ({ disabled }) => {
    const [open, setOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchTeachers = useCallback(
        debounce(async (value) => {
            if (!value) return;
            setLoading(true);
            try {
                const res = await dispatch(searchTeacher(value));
                setTeachers(res.payload || []);
            } catch (err) {
                console.error("Error al buscar docentes:", err);
            } finally {
                setLoading(false);
            }
        }, 400),
        []
    );

    useEffect(() => {
        if (open && search.length > 0) {
            fetchTeachers(search);
        } else {
            setTeachers([]);
        }
    }, [search, open, fetchTeachers]);

    const handleSubmit = async (values, actions) => {
        try {
            dispatch(createWorkHour(values));
            actions.resetForm();
            setOpen(false);
            setTeachers([]);
            setSearch("");
        } catch (error) {
            console.error("Error al crear:", error);
        } finally {
            actions.setSubmitting(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSearch("");
    };

    const initialValues = {
        teacherId: "",
        semana: "",
        dia: "",
        fecha: "",
        turno: "",
        local: "",
        grupo: "",
        curso: "",
        ingreso: "07:00",
        salida: "11:00",
        horasFijas: "00:00",
        horasDictadas: "00:00",
        tardanza: "00:00",
        observaciones: "",
        tipo: "COLEGIO",
        estado: "PENDING",
    };

    return (
        <>
            <Button startIcon={<Add />} fullWidth={isMobile} variant="contained" onClick={() => setOpen(true)} disabled={disabled}>
                Nuevo Registro
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
                scroll="body"
            >
                <DialogTitle sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <span style={{ alignSelf: "center" }}>Crear Horas de Trabajo</span>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>


                <Formik
                    initialValues={initialValues}
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, errors, touched, isSubmitting }) => (
                        <Form>
                            <DialogContent dividers>
                                <Stack spacing={2}>
                                    <Autocomplete
                                        options={teachers}
                                        getOptionLabel={(option) =>
                                            option?.user
                                                ? `${option.user.name} (${option.user.dni})`
                                                : ""
                                        }
                                        loading={loading}
                                        isOptionEqualToValue={(opt, val) => opt.id === val?.id}
                                        onChange={(_, value) => {
                                            setFieldValue("teacherId", value ? value.id : "");
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Buscar Docente por Nombre, DNI o Email"
                                                onChange={(e) => setSearch(e.target.value)}
                                                error={touched.teacherId && !!errors.teacherId}
                                                helperText={touched.teacherId && errors.teacherId}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {loading && <CircularProgress size={20} />}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />

                                    <Stack direction={["column", "column", "row"]} gap={2}>
                                        <Field name="fecha" as={TextField} type="date" fullWidth error={touched.fecha && !!errors.fecha} helperText={touched.fecha && errors.fecha} />
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
                                        <Field name="grupo" as={TextField} label="Grupo" fullWidth error={touched.grupo && !!errors.grupo} helperText={touched.grupo && errors.grupo} />
                                    </Stack>
                                    <Stack direction={["column", "column", "row"]} gap={2}>
                                        <Field name="local" as={TextField} label="Local" fullWidth error={touched.local && !!errors.local} helperText={touched.local && errors.local} />
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
                                            format="HH:mm"
                                            fullWidth
                                            error={touched.horasFijas && !!errors.horasFijas}
                                            helperText={touched.horasFijas && errors.horasFijas}
                                        />
                                        <Field
                                            as={TextField}
                                            name="tardanza"
                                            label="Tardanza"
                                            type="time"
                                            format="HH:mm"
                                            fullWidth
                                            error={touched.tardanza && !!errors.tardanza}
                                            helperText={touched.tardanza && errors.tardanza}
                                        />
                                        <Field name="horasDictadas" as={TextField} label="Horas Dictadas" format="HH:mm" type="time" fullWidth error={touched.horasDictadas && !!errors.horasDictadas} helperText={touched.horasDictadas && errors.horasDictadas} />
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
                                    Crear registro
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default WorkHourCreateModal;