// ClaimCreateModal.jsx
import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, Stack,
} from "@mui/material";
import { Add, Close as CloseIcon } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createClaim } from "../../../features/claimSlice";
import { updateStatusWorkHour } from "../../../features/workHourSlice";

const validationSchema = Yup.object({
    teacherId: Yup.string().required("Seleccione un docente"),
    workHourId: Yup.string().required("Seleccione una hora de trabajo"),
    title: Yup.string().required("Título requerido"),
    description: Yup.string().required("Descripción requerida"),
});

const ClaimCreateModal = ({ workHourId, teacherId }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (values, actions) => {
        try {
            await dispatch(createClaim(values)).unwrap();
            dispatch(updateStatusWorkHour({ id: workHourId, estado: 'REJECTED' }));
            actions.resetForm();
            setOpen(false);
        } catch (error) {
            console.error("Error creando reclamo:", error);
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <>
            <IconButton color="primary" onClick={() => setOpen(true)}>
                <Add />
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                    Crear Reclamo
                    <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
                </DialogTitle>

                <Formik
                    initialValues={{
                        teacherId: teacherId,
                        workHourId: workHourId,
                        title: "",
                        description: "",
                        status: "PENDING",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ touched, errors, isSubmitting }) => (
                        <Form>
                            <DialogContent dividers>
                                <Stack spacing={2}>
                                    <Field
                                        as={TextField}
                                        name="title"
                                        label="Título"
                                        fullWidth
                                        error={touched.title && !!errors.title}
                                        helperText={touched.title && errors.title}
                                    />
                                    <Field
                                        as={TextField}
                                        name="description"
                                        label="Descripción"
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        error={touched.description && !!errors.description}
                                        helperText={touched.description && errors.description}
                                    />
                                </Stack>
                            </DialogContent>

                            <DialogActions sx={{ p: 2 }}>
                                <Button onClick={() => setOpen(false)} variant="outlined">Cancelar</Button>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>Crear Reclamo</Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default ClaimCreateModal;
