import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, FileText, AlertCircle, DownloadCloud, SheetIcon, DownloadCloudIcon, ChevronDownIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { CustomToast } from "../../utils/CustomToast";
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
    Icon,
    LinearProgress,
    Tooltip,
    Menu,
    Alert,
    List,
    ListItem,
} from "@mui/material";
import { resetWorkHour, uploadWorkHours } from "../../features/workHourSlice";
import { SkippedItemsAlert } from "../ui/SkippedItemsAlert";
import { getSettings } from "../../features/settingSlice";

export default function WorkHoursAcademyImport() {
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const { workHoursSkippedAcademy, workHourImportResponse } = useSelector((state) => state.workHour);
    const { settings } = useSelector((state) => state.setting);

    useEffect(() => {
        dispatch(resetWorkHour());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getSettings());
    }, [dispatch]);

    const validateFile = (file) => {
        if (!file?.name.endsWith(".csv")) {
            CustomToast({
                title: "Formato inválido",
                message: "Por favor selecciona un archivo CSV válido.",
                type: "error",
                duration: 3000,
                position: "top",
            });
            return false;
        }
        return true;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (validateFile(file)) {
            setSelectedFile(file);
        } else {
            e.target.value = null;
        }
    };

    const handleDragEvents = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(type === "over");
    };

    const handleDrop = (e) => {
        handleDragEvents(e, "leave");
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            CustomToast({
                title: "Error",
                message: "Selecciona un archivo CSV antes de continuar.",
                type: "error",
                duration: 3000,
                position: "top",
            });
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(uploadWorkHours(selectedFile)).unwrap();
            setSelectedFile(null);
            fileInputRef.current.value = "";
        } catch (error) {
            const msg = error.response?.data?.message || "Error al subir el archivo.";
            CustomToast({
                title: "Error",
                message: msg,
                type: "error",
                duration: 3000,
                position: "top",
            });
            if (error.response?.status === 401) {
                setTimeout(() => (window.location.href = "/login"), 1500);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleGoogleSheets = () => {
        window.open(settings?.driveLink2, '_blank');
        handleMenuClose();
    };

    const handleDownload = () => {
        window.open(settings?.driveLink2 + '/export?format=csv&gid=0', '_blank');
        handleMenuClose();
    };

    return (
        <>
            <Stack spacing={3}>
                <Stack direction={["column", "row"]} justifyContent="space-between" gap={2} alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        Importar Horas de Trabajo - ACADEMIA
                    </Typography>
                    <Tooltip title="Opciones de importación">
                        <Button
                            onClick={handleMenuClick}
                            startIcon={<DownloadCloudIcon size={18} />}
                            endIcon={<ChevronDownIcon size={18} />}
                            variant="contained"
                            sx={{
                                width: { xs: "100%", sm: "auto", md: "auto", lg: "auto" }
                            }}
                        >
                            Importar
                        </Button>
                    </Tooltip>
                </Stack>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            minWidth: 280,
                            mt: 1,
                            p: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                        }
                    }}
                >
                    <Stack spacing={2}>
                        <Button
                            onClick={handleGoogleSheets}
                            startIcon={<SheetIcon size={18} />}
                            variant="outlined"
                            fullWidth
                            sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                py: 1
                            }}
                        >
                            Acceder a Google Sheets
                        </Button>
                        <Button
                            onClick={handleDownload}
                            startIcon={<DownloadCloud size={18} />}
                            variant="outlined"
                            fullWidth
                            sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                py: 1
                            }}
                        >
                            Descargar Datos
                        </Button>
                    </Stack>
                </Menu>

                {/* Área de carga */}
                <Paper
                    variant="outlined"
                    onClick={triggerFileInput}
                    onDragOver={(e) => handleDragEvents(e, "over")}
                    onDragLeave={(e) => handleDragEvents(e, "leave")}
                    onDrop={handleDrop}
                    sx={{
                        border: "2px dashed",
                        borderColor: dragActive ? "primary.main" : "divider",
                        borderRadius: "10px",
                        transition: "border-color 0.3s ease",
                        px: 4,
                        py: 6,
                        textAlign: "center",
                        cursor: "pointer",
                        '&:hover': {
                            borderColor: "primary.main",
                        },
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        hidden
                        onChange={handleFileChange}
                    />
                    <Stack spacing={1} alignItems="center">
                        <Icon>
                            <UploadCloud size={32} />
                        </Icon>
                        {selectedFile ? (
                            <>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <FileText color="info" size={20} />
                                    <Typography variant="body2">{selectedFile.name}</Typography>
                                </Stack>
                                <Typography variant="body2">
                                    Haz clic para cambiar el archivo
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Typography variant="body1">
                                    Arrastra y suelta tu archivo CSV aquí o haz clic para seleccionar
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Solo archivos CSV
                                </Typography>
                            </>
                        )}
                    </Stack>
                </Paper>

                {/* Alerta informativa */}
                {selectedFile && (
                    <Paper
                        sx={{
                            p: 2,
                            borderLeft: "4px solid",
                            borderColor: "info.main",
                        }}
                    >
                        <Stack direction="row" spacing={2}>
                            <Icon sx={{ color: "info.main" }}>
                                <AlertCircle size={20} />
                            </Icon>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                                    Información importante
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Asegúrate de que tu archivo CSV tenga el formato correcto antes de subirlo.
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                )}

                {/* Botón de acción */}
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<UploadCloud size={20} />}
                    disabled={!selectedFile || isLoading}
                    onClick={handleUpload}
                >
                    {isLoading ? "Subiendo..." : "Importar horas de trabajo"}
                </Button>

                {isLoading && <LinearProgress />}
            </Stack>
            {workHourImportResponse.academy && (
                <Stack sx={{ mt: 2, width: "100%", px: 0 }} direction={'column'}>
                    <List sx={{ width: "100%", px: 0 }}>
                        <ListItem sx={{ width: "100%", px: 0 }}>
                            <Alert severity="success" sx={{ width: "100%" }}>
                                <strong>TOTAL DE REGISTROS IMPORTADAS:</strong> {workHourImportResponse.academy?.totalImported}
                            </Alert>                            
                        </ListItem>
                        <ListItem sx={{ width: "100%", px: 0 }}>
                            <Alert severity="error" sx={{ width: "100%" }}>
                                <strong>TOTAL DE REGISTROS NO IMPORTADAS:</strong> {workHourImportResponse.academy?.totalSkipped}
                            </Alert>
                        </ListItem>
                        <ListItem sx={{ width: "100%", px: 0 }}>
                            <Alert severity="info" sx={{ width: "100%" }}>
                                <strong>DE UN TOTAL DE:</strong> {workHourImportResponse.academy?.total}
                            </Alert>
                        </ListItem>
                    </List>
                </Stack>
            )}
            <SkippedItemsAlert
                title="HORAS SALTADA ACADEMIA"
                description="Asegúrate de que tu archivo CSV tenga el formato correcto antes de subirlo."
                items={workHoursSkippedAcademy}
            />
        </>
    );
}
