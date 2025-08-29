// src/components/ui/InputField.jsx
import { useField } from "formik";
import { FormControl, FormLabel, Input, Typography } from "@mui/joy";

const InputField = ({ label, startDecorator, ...props }) => {
    const [field, meta] = useField(props.name);

    return (
        <FormControl error={meta.touched && Boolean(meta.error)} sx={{ width: "100%" }}>
            <FormLabel>{label}</FormLabel>
            <Input
                {...field}
                {...props}
                startDecorator={startDecorator}
                sx={{ mt: 0.5 }}
                size="md"
                autoComplete="on"
                fullWidth
            />
            {meta.touched && meta.error && (
                <Typography level="body-sm" color="danger" sx={{ mt: 0.5 }}>
                    {meta.error}
                </Typography>
            )}
        </FormControl>
    );
};

export default InputField;
