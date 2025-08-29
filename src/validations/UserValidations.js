import * as Yup from "yup";

export const userCreateValidationSchema = Yup.object({
    name: Yup.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede exceder 50 caracteres")
        .required("El nombre es obligatorio"),
    dni: Yup.string()
        .matches(/^\d{8}$/, "El DNI debe tener 8 digitos")
        .required("El DNI es obligatorio"),
    password: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .required("La contraseña es obligatoria"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
        .required("Confirmar contraseña es obligatorio"),
    role: Yup.string()
        .oneOf(["ADMIN", "TEACHER", "USER", "SECRETARY", "SUPERVISOR"], "Rol inválido")
        .required("El rol es obligatorio"),
});


export const userUpdateValidationSchema = Yup.object({
    name: Yup.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede exceder 50 caracteres")
        .required("El nombre es obligatorio"),
    dni: Yup.string()
        .matches(/^\d{8}$/, "El DNI debe tener 8 digitos")
        .required("El DNI es obligatorio"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir"),
    role: Yup.string()
        .oneOf(["ADMIN", "TEACHER", "USER", "SECRETARY", "SUPERVISOR"], "Rol inválido")
        .required("El rol es obligatorio"),
});