import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Divider, MenuItem, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import MuiDataTable from "../../ui/DataTable";
import { getWorkHourByTeacherId, getWorkHoursByMonthWeekDay } from "../../../features/workHourSlice";
import { getSettings } from "../../../features/settingSlice";
import { createColumnHelper } from "@tanstack/react-table";
import ClaimCreateModal from "./ClaimCreateModal";
import ClaimViewModal from "./ClaimViewModal";
import ConfirmChangeStateDialog from "./ConfirmChangeStateDialog";
import moment from "moment";
import { AlertCircle, CheckCircle, CheckCircle2 } from "lucide-react";
import CountdownTimer from "../../ui/CountdownTimer";

const WorkHoursTeacher = () => {
    const { user } = useSelector((state) => state.auth);
    const teacher = user?.user?.teacher;
    const { workHoursTeacher, isLoading, error } = useSelector((state) => state.workHour);
    const { settings } = useSelector((state) => state.setting);
    const dispatch = useDispatch();
    const columnHelper = createColumnHelper();
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [week, setWeek] = useState("");
    const [day, setDay] = useState("");

    useEffect(() => {
        dispatch(getWorkHourByTeacherId(teacher?.id));
        dispatch(getSettings());
    }, [dispatch, teacher?.id]);

    const calculateDeadline = (createdAt) => {
        if (!createdAt || !settings) return null;

        const amount = settings.autoApproveAmount || 4;
        const unit = settings.autoApproveUnit || 'DAYS';

        let deadline = moment(createdAt);

        switch (unit) {
            case 'MINUTES':
                deadline.add(amount, 'minutes');
                break;
            case 'HOURS':
                deadline.add(amount, 'hours');
                break;
            case 'DAYS':
            default:
                deadline.add(amount, 'days');
                break;
        }

        return deadline.toDate();
    };

    const handleRefresh = () => {
        dispatch(getWorkHourByTeacherId(teacher?.id));
    };

    const handleGetWorkHoursByMonthWeekDay = () => {
        dispatch(getWorkHoursByMonthWeekDay({ id: teacher?.id, data: { month, week, day } }));
    };

    const handleClearFilters = () => {
        setMonth(new Date().getMonth() + 1);
        setWeek("");
        setDay("");
        dispatch(getWorkHourByTeacherId(teacher?.id));
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
            minutos: minutosFinales,
        };
    };

    const totalHorasFijas = sumarCampoHoras(workHoursTeacher, 'horasFijas');
    const totalHorasDictadas = sumarCampoHoras(workHoursTeacher, 'horasDictadas');
    const totalTardanza = sumarCampoHoras(workHoursTeacher, 'tardanza');

    const columns = [
        columnHelper.accessor("semana", {
            header: "SEM.",
            cell: ({ row }) => {
                const semana = row?.original?.semana;
                return <Typography variant="body2" fontSize={'0.75rem'}>{`SEM-${semana}`}</Typography>;
            },
        }),
        columnHelper.accessor("dia", {
            header: "DIA",
        }),
        columnHelper.accessor("fecha", {
            header: "FECHA",
            cell: ({ row }) => {
                const fecha = row?.original?.fecha;
                return <Typography variant="body2" fontSize={'0.75rem'}>{moment.utc(fecha).format("DD/MM/YYYY") || "N/A"}</Typography>;
            },
        }),
        columnHelper.accessor("turno", {
            header: "TURNO",
        }),
        columnHelper.accessor("local", {
            header: "LOCAL",
        }),
        columnHelper.accessor("grupo", {
            header: "GRUPO",
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
        }),
        columnHelper.accessor("horasFijas", {
            header: "H. FIJAS",
            cell: ({ getValue }) => {
                const horasFijas = getValue();
                return <Typography variant="body2" fontSize={'0.75rem'}>{moment(horasFijas, "HH:mm").format("HH")}h {moment(horasFijas, "HH:mm").format("mm")}min</Typography>;
            },
        }),
        columnHelper.accessor("tardanza", {
            header: "TARDANZA",
            cell: ({ row }) => {
                const tardanza = row?.original?.tardanza;
                if (tardanza) {
                    return <Typography variant="body2" fontSize={'0.75rem'}>{moment(tardanza, "HH:mm").format("HH")}h {moment(tardanza, "HH:mm").format("mm")}min</Typography>;
                }
                return null;
            },
        }),
        columnHelper.accessor("horasDictadas", {
            header: "H. DICTADAS",
            cell: ({ getValue }) => {
                const horasDictadas = getValue();
                return <Typography variant="body2" fontSize={'0.75rem'}>{moment(horasDictadas, "HH:mm").format("HH")}h {moment(horasDictadas, "HH:mm").format("mm")}min</Typography>;
            },
        }),
        columnHelper.accessor("tipo", {
            header: "TIPO",
            cell: ({ row }) => {
                return (
                    <Chip
                        sx={{ color: 'white', borderRadius: 1.5, boxShadow: 1, fontSize: '0.75rem' }}
                        label={row.original.tipo || '_'}
                        style={{ color: 'white' }}
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
            cell: ({ row }) => (
                    <Stack direction="row" gap={1}>
                    {row.original.estado === "PENDING" && (
                            <>
                                <ClaimCreateModal workHourId={row.original.id} teacherId={row.original.teacherId} />
                                <ConfirmChangeStateDialog idWorkHour={row.original.id} />
                            </>
                        )}
                        {row.original.estado === "REJECTED" && (
                            <>
                                <ClaimViewModal idWorkHour={row.original.id} commentsCount={row.original?.claim?._count.comments || 0} />
                            <ConfirmChangeStateDialog idWorkHour={row.original.id} />
                            </>

                        )}
                        {
                            row.original.estado === "ACCEPTED" && row.original.claim ? (
                                <ClaimViewModal idWorkHour={row.original.id} commentsCount={row.original?.claim?._count.comments || 0} />
                            ) : null
                        }
                    </Stack>
            ),
        }),
    ];

    return (
        <>
            <Typography variant="h5" fontWeight="bold">Mis Horas Trabajadas</Typography>
            <Divider sx={{ my: 2 }} />
            {error &&
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            }

            {/* Countdown Alert for Next Approval */}
            {workHoursTeacher?.some(wh => wh.estado === "PENDING") && settings && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        '& .MuiAlert-message': { width: '100%' }
                    }}
                    icon={false}
                    elevation={2}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        spacing={2}
                    >
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                Tiempo restante para aprobación automática de conformidad
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sus horas pendientes se darán conformidad automáticamente cuando el contador llegue a cero.
                            </Typography>
                        </Box>
                        <Box>
                            {(() => {
                                const pending = workHoursTeacher.filter(wh => wh.estado === "PENDING");
                                const deadlines = pending.map(wh => calculateDeadline(wh.createdAt));
                                const nearest = deadlines.sort((a, b) => a - b)[0];
                                return <CountdownTimer targetDate={nearest} />;
                            })()}
                        </Box>
                    </Stack>
                </Alert>
            )}

            {/* filtros mes semana dia */}

            <Stack direction="row" spacing={2} mt={2} mb={2}>
                <TextField label="Mes" type="month" select sx={{ width: '100%' }} onChange={(e) => setMonth(e.target.value)} value={month}>
                    <MenuItem value="1">ENERO</MenuItem>
                    <MenuItem value="2">FEBRERO</MenuItem>
                    <MenuItem value="3">MARZO</MenuItem>
                    <MenuItem value="4">ABRIL</MenuItem>
                    <MenuItem value="5">MAYO</MenuItem>
                    <MenuItem value="6">JUNIO</MenuItem>
                    <MenuItem value="7">JULIO</MenuItem>
                    <MenuItem value="8">AGOSTO</MenuItem>
                    <MenuItem value="9">SEPTIEMBRE</MenuItem>
                    <MenuItem value="10">OCTUBRE</MenuItem>
                    <MenuItem value="11">NOVIEMBRE</MenuItem>
                    <MenuItem value="12">DICIEMBRE</MenuItem>
                </TextField>
                <TextField label="Semana" type="number" select sx={{ width: '100%' }} onChange={(e) => setWeek(e.target.value)} value={week}>
                    <MenuItem value="1">SEMANA 1</MenuItem>
                    <MenuItem value="2">SEMANA 2</MenuItem>
                    <MenuItem value="3">SEMANA 3</MenuItem>
                    <MenuItem value="4">SEMANA 4</MenuItem>
                    <MenuItem value="5">SEMANA 5</MenuItem>
                </TextField>
                <TextField label="Día" type="number" select sx={{ width: '100%' }} onChange={(e) => setDay(e.target.value)} value={day}>
                    <MenuItem value="lunes">LUNES</MenuItem>
                    <MenuItem value="martes">MARTES</MenuItem>
                    <MenuItem value="miercoles">MIERCOLES</MenuItem>
                    <MenuItem value="jueves">JUEVES</MenuItem>
                    <MenuItem value="viernes">VIERNES</MenuItem>
                    <MenuItem value="sabado">SABADO</MenuItem>
                    <MenuItem value="domingo">DOMINGO</MenuItem>
                </TextField>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" mb={2} width="100%" spacing={2}>
                <Button variant="contained" fullWidth disabled={!month} color="primary" onClick={handleGetWorkHoursByMonthWeekDay}>CONSULTAR</Button>
                <Button variant="outlined" fullWidth onClick={handleClearFilters}>BORRAR FILTROS</Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction={["column", "column", "column", "row"]} justifyContent="flex-end" mb={2} gap={1} width="100%">
                <Box sx={{ width: '100%', boxShadow: 1, borderRadius: 2 }} elevation={2}>
                    {
                        isLoading ? (
                            <Skeleton variant="rectangular" width="100%" height={200} />
                        ) : (

                            <Stack direction={'column'} gap={1} p={1.5} justifyContent={'space-between'} >
                                <Stack direction={'row'} gap={1} justifyContent={'space-between'}>
                                    <Typography fontSize={'1rem'} alignSelf={'center'} fontWeight="semibold">TOTAL DE HORAS FIJAS</Typography>
                                    <Chip size="large" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} label={`${totalHorasFijas?.horas || 0}h ${totalHorasFijas?.minutos || 0}min`} variant="outlined" icon={<CheckCircle />} color="success" />
                                </Stack>
                                <Divider sx={{ my: 1 }} />
                                <Stack direction={'row'} gap={1} justifyContent={'space-between'}>
                                    <Typography fontSize={'1rem'} alignSelf={'center'} fontWeight="semibold">TOTAL DE TARDANZA</Typography>
                                    <Chip size="large" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} label={`${totalTardanza?.horas || 0}h ${totalTardanza?.minutos || 0}min`} variant="outlined" icon={<AlertCircle />} color="error" />
                                </Stack>
                                <Divider sx={{ my: 1 }} />
                                <Stack direction={'row'} gap={1} justifyContent={'space-between'}>
                                    <Typography fontSize={'1rem'} alignSelf={'center'} fontWeight="semibold">TOTAL DE HORAS TRABAJADAS / DICTADAS</Typography>
                                    <Chip size="large" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} label={`${totalHorasDictadas?.horas || 0}h ${totalHorasDictadas?.minutos || 0}min`} variant="outlined" icon={<CheckCircle2 />} color="info" />
                                </Stack>
                            </Stack>
                        )
                    }

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
                    initialPageSize={50}
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
        </>
    )
};

export default WorkHoursTeacher;