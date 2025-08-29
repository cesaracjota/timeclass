import React, { useState } from "react";
import {
    Button,
    TextField,
    Stack,
    Paper,
    Typography,
    Divider,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2Icon } from "lucide-react";
import { changePassword } from "../../features/authSlice";

const schema = Yup.object({
    oldPassword: Yup.string().required("Contraseña actual requerida"),
    newPassword: Yup.string().required("Nueva contraseña requerida"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden")
        .required("Confirmar contraseña requerida"),
});

const ChangePassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const togglePassword = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (values, actions) => {
        try {
            const resultAction = await dispatch(changePassword(values));
            if (changePassword.fulfilled.match(resultAction)) {
                navigate("/");
            } else {
                console.error("Falló el cambio de contraseña:", resultAction);
            }
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
        } finally {
            actions.setSubmitting(false);
        }
    };    

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            p={4}
        >
            <Paper
                elevation={2}
                sx={{ maxWidth: 550, width: "100%", p: 6, borderRadius: 2 }}
            >
                <Typography variant="h4" fontWeight={500} gutterBottom align="center">
                    Actualizar Mi Contraseña
                </Typography>
                <Divider sx={{ mb:3, mt: 3 }} />

                <Formik
                    initialValues={{
                        userId: user?.user?.id,
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                        changePassword: true,
                    }}
                    enableReinitialize={false}
                    validateOnChange={true}
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Stack spacing={2} mb={3}>
                                <Field
                                    as={TextField}
                                    name="oldPassword"
                                    label="Contraseña Actual"
                                    type={showPassword.old ? "text" : "password"}
                                    fullWidth
                                    autoComplete="current-password"
                                    error={touched.oldPassword && !!errors.oldPassword}
                                    helperText={touched.oldPassword && errors.oldPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePassword("old")}
                                                    edge="end"
                                                >
                                                    {showPassword.old ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Field
                                    as={TextField}
                                    name="newPassword"
                                    label="Nueva Contraseña"
                                    type={showPassword.new ? "text" : "password"}
                                    fullWidth
                                    autoComplete="new-password"
                                    error={touched.newPassword && !!errors.newPassword}
                                    helperText={touched.newPassword && errors.newPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePassword("new")}
                                                    edge="end"
                                                >
                                                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Field
                                    as={TextField}
                                    name="confirmPassword"
                                    label="Confirmar Contraseña"
                                    type={showPassword.confirm ? "text" : "password"}
                                    fullWidth
                                    autoComplete="new-password"
                                    error={touched.confirmPassword && !!errors.confirmPassword}
                                    helperText={
                                        touched.confirmPassword && errors.confirmPassword
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePassword("confirm")}
                                                    edge="end"
                                                >
                                                    {showPassword.confirm ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Stack>

                            <Divider sx={{ mb:3, mt: 3 }} />

                            <Stack gap={2} direction="column">
                                <Button
                                    type="submit"
                                    fullWidth
                                    color="primary"
                                    size="large"
                                    variant="contained"
                                    startIcon={<CheckCircle2Icon />}
                                    disabled={isLoading}
                                    loading={isLoading}
                                    loadingPosition="start"
                                >
                                    {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                                </Button>
                                <Button
                                    fullWidth
                                    color="error"
                                    size="large"
                                    variant="outlined"
                                    onClick={handleCancel}
                                >
                                    No cambiar mi contraseña
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Stack>
    );
};

export default ChangePassword;
