import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined, PersonOutline } from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { login } from "../../features/authSlice";
import { CustomToast } from "../../utils/CustomToast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    identifier: "",
    password: "",
  };

  const validationSchema = Yup.object({
    identifier: Yup.string().required("Usuario es requerido"),
    password: Yup.string().required("Contraseña es requerida"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values)).unwrap();
      navigate("/change-password", { replace: true });
    } catch (error) {
      CustomToast({
        title: "Error",
        message: error?.message || "Credenciales incorrectas",
        type: "error",
        duration: 2500,
        position: "bottom",
      });
    }
    setSubmitting(false);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Paper elevation={3} sx={{ p: 6, width: "100%", maxWidth: 500, borderRadius: 4 }}>
        <Box textAlign="center" mb={2}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }} className="text-primary text-center">TIMECLASS</h1>
          <Typography variant="h6">Sistema de Consulta de Horas Docentes</Typography>
          <img style={{ width: "80px", height: "80px", margin: "0 auto" }} src="/logo.png" type="image/png" alt="TIMECLASS" className="w-10 h-10" />
        </Box>


        <Divider sx={{ my: 3 }}>DNI / CORREO</Divider>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <Form noValidate>
              <Stack spacing={2}>
                <TextField
                  name="identifier"
                  label="Usuario"
                  placeholder="Correo o DNI"
                  fullWidth
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.identifier}
                  error={touched.identifier && Boolean(errors.identifier)}
                  helperText={touched.identifier && errors.identifier}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  name="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={isSubmitting || isLoading}
                  startIcon={
                    isSubmitting || isLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  {isSubmitting || isLoading ? "Iniciando..." : "Iniciar Sesión"}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default Login;