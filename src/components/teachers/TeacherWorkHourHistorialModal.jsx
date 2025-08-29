import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    IconButton,
    Typography,
    Button,
    Stack,
    TextField,
    Tooltip,
    Divider,
    Chip,
    useTheme,
    alpha,
    MenuItem,
    DialogTitle,
    Avatar,
    Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";
import { getWorkHourByTeacherId, getWorkHoursByMonthWeekDay } from "../../features/workHourSlice";
import moment from "moment";
import MuiDataTable from "../ui/DataTable";
import { AlertCircle, CheckCircle, CheckCircle2, HistoryIcon, X } from "lucide-react";
import ClaimViewModal from "../workHours/teacher/ClaimViewModal";
import WorkHourEditModal from "../workHours/WorkHourEditModal";

const TeacherWorkHourHistorialModal = ({ teacherId, teacher }) => {
    const [open, setOpen] = useState(false);
    const { workHoursTeacher, isLoading } = useSelector((state) => state.workHour);
    const dispatch = useDispatch();
    const columnHelper = createColumnHelper();
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [week, setWeek] = useState("");
    const [day, setDay] = useState("");
    const theme = useTheme();

    const months = [
        { value: 1, label: "ENERO" },
        { value: 2, label: "FEBRERO" },
        { value: 3, label: "MARZO" },
        { value: 4, label: "ABRIL" },
        { value: 5, label: "MAYO" },
        { value: 6, label: "JUNIO" },
        { value: 7, label: "JULIO" },
        { value: 8, label: "AGOSTO" },
        { value: 9, label: "SEPTIEMBRE" },
        { value: 10, label: "OCTUBRE" },
        { value: 11, label: "NOVIEMBRE" },
        { value: 12, label: "DICIEMBRE" },
    ];

    const days = [
        "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO", "DOMINGO"
    ];

    const fetchWorkHours = async () => {
        try {
            dispatch(getWorkHourByTeacherId(teacherId));
        } catch (error) {
            console.error("Error al obtener historial:", error);
        } finally {
            console.log("finally");
        }
    };

    const handleRefresh = () => {
        dispatch(getWorkHourByTeacherId(teacherId));
    };

    const handleGetWorkHoursByMonthWeekDay = () => {
        dispatch(getWorkHoursByMonthWeekDay({ id: teacherId, data: { month, week, day } }));
    };

    const handleOpen = async () => {
        setOpen(true);
        await fetchWorkHours();
    };

    const handleClose = () => {
        setOpen(false);
        setMonth(new Date().getMonth() + 1);
        setWeek("");
        setDay("");
    };

    const handleClearFilters = () => {
        setMonth(new Date().getMonth() + 1);
        setWeek("");
        setDay("");
        dispatch(getWorkHourByTeacherId(teacherId));
    };

    const convertirAHorasDecimales = (hora) => {
        if (!hora) return 0;

        // Asegurarnos de que la hora tenga el formato correcto
        const [horas, minutos] = hora.split(':').map(part => parseInt(part) || 0);

        // Convertir a decimal (ejemplo: 2:30 -> 2.5)
        return horas + (minutos / 60);
    };

    // Función generalizada para sumar cualquier campo (ej. horasDictadas, tardanza, etc.)
    const sumarCampoHoras = (workHours, campo) => {
        if (!workHours?.length) {
            return { decimal: 0, horas: 0, minutos: 0 };
        }

        const totalDecimal = workHours.reduce((total, item) => {
            const valor = item[campo] ? convertirAHorasDecimales(item[campo]) : 0;
            return total + valor;
        }, 0);

        // Convertir el total decimal a horas y minutos
        const horas = Math.floor(totalDecimal);
        const minutos = Math.round((totalDecimal - horas) * 60);

        // Ajustar si los minutos superan 60
        const horasExtra = Math.floor(minutos / 60);
        const minutosFinales = minutos % 60;

        return {
            decimal: totalDecimal,
            horas: horas + horasExtra,
            minutos: minutosFinales
        };
    };

    const totalHorasFijas = sumarCampoHoras(workHoursTeacher, 'horasFijas');
    const totalHorasDictadas = sumarCampoHoras(workHoursTeacher, 'horasDictadas');
    const totalTardanza = sumarCampoHoras(workHoursTeacher, 'tardanza');

    const columns = [
        columnHelper.accessor("semana", {
            header: "SEMANA",
            cell: ({ row }) => {
                const semana = row?.original?.semana;
                return <Typography variant="body2" fontSize={'0.75rem'}>{`SEMANA ${semana}`}</Typography>;
            },
        }),
        columnHelper.accessor("dia", {
            header: "DIA",
        }),
        columnHelper.accessor("fecha", {
            header: "FECHA",
            cell: ({ getValue }) => {
                const fecha = getValue();
                return <Typography variant="body2" fontSize={'0.75rem'}>{moment.utc(fecha).format("DD/MM/YYYY")}</Typography>;
            },
        }),
        columnHelper.accessor("turno", {
            header: "TURNO",
            cell: ({ row }) => {
                const turno = row?.original?.turno;
                return <Typography variant="body2" fontSize={'0.75rem'} noWrap>{turno}</Typography>;
            },
        }),
        columnHelper.accessor("local", {
            header: "LOCAL",
        }),
        columnHelper.accessor("grupo", {
            header: "GRUPO",
            cell: ({ row }) => {
                const grupo = row?.original?.grupo;
                return <Typography variant="body2" fontSize={'0.75rem'} noWrap>{grupo}</Typography>;
            },
        }),
        columnHelper.accessor("curso", {
            header: "CURSO",
            cell: ({ row }) => {
                const curso = row?.original?.curso;
                return <Typography variant="body2" fontSize={'0.75rem'}>{curso}</Typography>;
            },
        }),
        columnHelper.accessor("ingreso", {
            header: "INGRESO",
            cell: ({ row }) => {
                const ingreso = row?.original?.ingreso;
                return <Typography variant="body2" fontSize={'0.75rem'}>{ingreso ? moment(ingreso, "HH:mm").format("HH") + "h " + moment(ingreso, "HH:mm").format("mm") + "min" : "-"}</Typography>;
            },
        }),
        columnHelper.accessor("salida", {
            header: "SALIDA",
            cell: ({ row }) => {
                const salida = row?.original?.salida;
                return <Typography variant="body2" fontSize={'0.75rem'}>{salida ? moment(salida, "HH:mm").format("HH") + "h " + moment(salida, "HH:mm").format("mm") + "min" : "-"}</Typography>;
            },
        }),
        columnHelper.accessor("horasFijas", {
            header: "HORAS FIJAS",
            cell: ({ getValue }) => {
                const horasFijas = getValue();
                if (horasFijas.includes(":")) {
                    return <Typography variant="body2" fontSize={'0.75rem'}>{moment(horasFijas, "HH:mm").format("HH")}h {moment(horasFijas, "HH:mm").format("mm")}min</Typography>;
                } else {
                    return <Typography variant="body2" fontSize={'0.75rem'}>{horasFijas}min</Typography>;
                }
            },
        }),
        // tardanza es un campo que puede ser null, por lo que no se debe mostrar en la tabla
        columnHelper.accessor("tardanza", {
            header: "TARDANZA",
            cell: ({ row }) => {
                const tardanza = row?.original?.tardanza;
                if (tardanza) {
                    if (tardanza.includes(":")) {
                        return <Typography variant="body2" fontSize={'0.75rem'}>{moment(tardanza, "HH:mm").format("HH")}h {moment(tardanza, "HH:mm").format("mm")}min</Typography>;
                    } else {
                        return <Typography variant="body2" fontSize={'0.75rem'}>{tardanza}min</Typography>;
                    }
                }
                return null;
            },
        }),
        columnHelper.accessor("horasDictadas", {
            header: "HORAS DICTADAS",
            cell: ({ getValue }) => {
                const horasDictadas = getValue();
                if (horasDictadas.includes(":")) {
                    return <Typography variant="body2" fontSize={'0.75rem'}>{moment(horasDictadas, "HH:mm").format("HH")}h {moment(horasDictadas, "HH:mm").format("mm")}min</Typography>;
                } else {
                    return <Typography variant="body2" fontSize={'0.75rem'}>{horasDictadas}min</Typography>;
                }
            },
        }),
        columnHelper.accessor("tipo", {
            header: "TIPO",
            cell: ({ row }) => {
                return (
                    <Chip
                        sx={{ color: 'white', borderRadius: 1.5, boxShadow: 1, fontSize: '0.75rem' }}
                        label={row.original.tipo}
                        color={row.original.tipo === "ACADEMIA" ? "secondary" : "primary"}
                    />
                )
            },
        }),
        columnHelper.accessor("estado", {
            header: "ESTADO",
            cell: ({ row }) => (
                <Chip
                    sx={{ color: 'white', borderRadius: 1.5, boxShadow: 1, fontSize: '0.75rem' }}
                    label={
                        row.original.estado === "PENDING" ? "PENDIENTE" : row.original.estado === "ACCEPTED" ? "CONFORME" : "INCONFORME"
                    } color={row.original.estado === "PENDING" ? "warning" : row.original.estado === "ACCEPTED" ? "success" : "error"} />
            ),
        }),
        columnHelper.accessor("actions", {
            header: "ACCIONES",
            enableHiding: true,
            size: 100,
            enableResizing: false,
            enableSorting: false,
            cell: ({ row }) => (
                <Box component={'div'} sx={{ display: 'flex', gap: 1 }}>
                    {
                        row.original.claim ? (
                            <ClaimViewModal idWorkHour={row.original.id} commentsCount={row.original.claim._count.comments} />
                        ) : null
                    }
                    <WorkHourEditModal data={row.original} />
                </Box>
            ),
        }),
    ];

    return (
        <>
            <Tooltip title="Ver historial de horas" placement="top">
                <IconButton
                    color="primary"
                    onClick={handleOpen}
                    sx={{
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                        }
                    }}
                >
                    <HistoryIcon size={20} />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
            >
                {/* Header */}
                <DialogTitle sx={{ py: 1, display: 'flex', boxShadow: 1, justifyContent: 'space-between', alignItems: 'center' }}>

                    <Box display="flex" alignItems="center" gap={1} flexDirection={["column", "column", "column", "row"]}>
                        <Box display="flex" gap={1} alignItems="center">
                            <Typography fontWeight="bold">HISTORIAL DE:</Typography>
                            <Avatar src={teacher?.user?.avatar} sx={{ color: 'white', bgcolor: 'primary.main', width: 25, height: 25, fontSize: 16 }}>
                                {teacher?.user?.name?.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{teacher?.user?.name}</Typography>
                        </Box>
                    </Box>
                    <IconButton size="medium" onClick={handleClose}>
                        <X size={20} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                    <Stack direction="row" spacing={2} mt={2} mb={2}>
                        <TextField label="Mes" type="month" select sx={{ width: '100%' }} onChange={(e) => setMonth(e.target.value)} value={month}>
                            {
                                months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                ))
                            }
                        </TextField>
                        <TextField label="Semana" type="number" select sx={{ width: '100%' }} onChange={(e) => setWeek(e.target.value)} value={week}>
                            <MenuItem value="1">SEMANA 1</MenuItem>
                            <MenuItem value="2">SEMANA 2</MenuItem>
                            <MenuItem value="3">SEMANA 3</MenuItem>
                            <MenuItem value="4">SEMANA 4</MenuItem>
                            <MenuItem value="5">SEMANA 5</MenuItem>
                        </TextField>
                        <TextField label="Día" type="number" select sx={{ width: '100%' }} onChange={(e) => setDay(e.target.value)} value={day}>
                            {
                                days.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))
                            }
                        </TextField>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-end" mb={2} width="100%" spacing={2}>
                        <Button variant="contained" fullWidth disabled={!month} color="primary" onClick={handleGetWorkHoursByMonthWeekDay}>CONSULTAR</Button>
                        <Button variant="outlined" fullWidth onClick={handleClearFilters}>BORRAR FILTROS</Button>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction={["column", "column", "column", "row"]} justifyContent="flex-end" mb={2} gap={1} width="100%">
                        <Box sx={{ width: '100%', boxShadow: 1, borderRadius: 2 }} elevation={2} square raised>
                            <Stack direction={'column'} gap={1} p={1.5} justifyContent={'space-between'} >
                                <Stack direction={'row'} gap={1} justifyContent={'space-between'}>
                                    <Typography fontSize={'1rem'} alignSelf={'center'} fontWeight="semibold"> TOTAL DE HORAS FIJAS</Typography>
                                    <Chip size="large" sx={{ fontSize: '1rem' }} label={`${totalHorasFijas?.horas || 0}h ${totalHorasFijas?.minutos || 0}min`} variant="outlined" icon={<CheckCircle />} color="success" />
                                </Stack>
                                <Divider sx={{ my: 1 }} />
                                <Stack direction={'row'} gap={1} justifyContent={'space-between'}>
                                    <Typography fontSize={'1rem'} alignSelf={'center'} fontWeight="semibold">TOTAL DE TARDANZA</Typography>
                                    <Chip size="large" sx={{ fontSize: '1rem' }} label={`${totalTardanza?.horas || 0}h ${totalTardanza?.minutos || 0}min`} variant="outlined" icon={<AlertCircle />} color="error" />
                                </Stack>
                                <Divider sx={{ my: 1 }} />
                                <Stack direction={'row'} gap={1} justifyContent={'space-between'}>
                                    <Typography fontSize={'1rem'} alignSelf={'center'} fontWeight="semibold">TOTAL DE HORAS TRABAJADAS / DICTADAS</Typography>
                                    <Chip size="large" sx={{ fontSize: '1rem' }} label={`${totalHorasDictadas?.horas || 0}h ${totalHorasDictadas?.minutos || 0}min`} variant="outlined" icon={<CheckCircle2 />} color="info" />
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>

                    {workHoursTeacher?.length > 0 && (
                        <MuiDataTable
                            data={workHoursTeacher}
                            columns={columns}
                            isLoading={isLoading}
                            onRefresh={handleRefresh}
                            stickyActions={true}
                            actionsColumnId="actions"
                            options={{
                                selectableRows: false,
                                filter: false,
                                print: false,
                                download: false,
                                viewColumns: false,
                            }}
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    py: 1.5
                                }
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TeacherWorkHourHistorialModal;