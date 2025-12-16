import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Typography,
    IconButton,
    Stack,
    Chip,
    Checkbox,
    ToggleButtonGroup,
    ToggleButton,
    useMediaQuery,
    Button,
    Menu,
    Select,
    InputLabel,
    FormControl,
    MenuItem
} from "@mui/material";
import { DeleteConfirmDialog } from "../ui/DeleteConfirmDialog";
import { AllInbox, Cancel, CheckCircle, DeleteOutline, PendingActions } from "@mui/icons-material";
import { deleteWorkHour, getAllWorkHours, getAllWorkHoursByStatus } from "../../features/workHourSlice";
import WorkHourCreateModal from "./WorkHourCreateModal";
import WorkHourEditModal from "./WorkHourEditModal";
import ClaimViewModal from "./teacher/ClaimViewModal";
import moment from "moment";
import DataTableAPI from "../ui/DataTableAPI";
import ExcelJS from "exceljs";

const WorkHours = () => {
    const { workHours, isLoading, totalPages, totalItems } = useSelector((state) => state.workHour);
    const { role } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");

    useEffect(() => {
        if (status === "ALL") {
            dispatch(getAllWorkHours({ page, limit, search }));
        } else {
            dispatch(getAllWorkHoursByStatus({ page, limit, estado: status, search }));
        }
    }, [dispatch, page, limit, search, status]);


    const handleDelete = async (id) => {
        try {
            await dispatch(deleteWorkHour(id)).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    // funcion para buscar por estado
    const handleSearchByStatus = async (data) => {
        try {
            if (data === "ALL") {
                setStatus(data);
                setPage(1);
                await dispatch(getAllWorkHours({ page, limit, search })).unwrap();
                return;
            }
            setStatus(data);
            setPage(1);
            await dispatch(getAllWorkHoursByStatus({ page, limit, estado: data, search })).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRefresh = async () => {
        setPage(1);
        setStatus("ALL");
        try {
            await dispatch(getAllWorkHours({ page, limit, search })).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    const handlePageChange = (newPage) => {
        if (status !== "ALL") {
            setPage(newPage);
            dispatch(getAllWorkHoursByStatus({ page: newPage, limit, estado: status, search }));
            return;
        }
        setPage(newPage);
        dispatch(getAllWorkHours({ page: newPage, limit, search }));
    };

    const handleRowsPerPageChange = (newLimit) => {
        if (status !== "ALL") {
            setLimit(newLimit);
            setPage(1);
            dispatch(getAllWorkHoursByStatus({ page: 1, limit: newLimit, estado: status, search }));
            return;
        }
        setLimit(newLimit);
        setPage(1);
    };


    const handleSearchChange = (value) => {
        if (status !== "ALL") {
            setSearch(value);
            setPage(1);
            dispatch(getAllWorkHoursByStatus({ page: 1, limit, estado: status, search: value }));
            return;
        }
        setSearch(value);
        setPage(1);
    };

    const handleExportCSV = (rows) => {
        const csvData = [
            ['DOCENTE', 'DNI', 'ESTADO', 'SEMANA', 'DIA', 'FECHA', 'TURNO', 'LOCAL', 'GRUPO', 'HORAS FIJAS', 'TARDANZA', 'HORAS DICTADAS', 'INGRESO', 'SALIDA', 'TIPO'],
            ...rows.map((row) => [
                row.original.teacher.user.name,
                row.original.teacher.user.dni,
                row.original.estado,
                row.original.semana,
                row.original.dia,
                row.original.fecha,
                row.original.turno,
                row.original.local,
                row.original.grupo,
                row.original.horasFijas,
                row.original.tardanza,
                row.original.horasDictadas,
                row.original.ingreso,
                row.original.salida,
                row.original.tipo,
            ]),
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `HORAS-DE-TRABAJO-${moment().format('DD-MM-YYYY')}_horas_de_trabajo.csv`;
        link.click();
    };

    const handleExportExcel = async (rows) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('HORAS DE TRABAJO');

        worksheet.columns = [
            { header: 'DOCENTE', key: 'teacher' },
            { header: 'DNI', key: 'dni' },
            { header: 'ESTADO', key: 'estado' },
            { header: 'SEMANA', key: 'semana' },
            { header: 'DIA', key: 'dia' },
            { header: 'FECHA', key: 'fecha' },
            { header: 'TURNO', key: 'turno' },
            { header: 'LOCAL', key: 'local' },
            { header: 'GRUPO', key: 'grupo' },
            { header: 'HORAS FIJAS', key: 'horasFijas' },
            { header: 'TARDANZA', key: 'tardanza' },
            { header: 'HORAS DICTADAS', key: 'horasDictadas' },
            { header: 'INGRESO', key: 'ingreso' },
            { header: 'SALIDA', key: 'salida' },
            { header: 'TIPO', key: 'tipo' },
        ];

        rows.forEach((row) => {
            worksheet.addRow({
                teacher: row.original.teacher.user.name,
                dni: row.original.teacher.user.dni,
                estado: row.original.estado,
                semana: row.original.semana,
                dia: row.original.dia,
                fecha: row.original.fecha,
                turno: row.original.turno,
                local: row.original.local,
                grupo: row.original.grupo,
                horasFijas: row.original.horasFijas,
                tardanza: row.original.tardanza,
                horasDictadas: row.original.horasDictadas,
                ingreso: row.original.ingreso,
                salida: row.original.salida,
                tipo: row.original.tipo,
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `HORAS-DE-TRABAJO-${moment().format('DD-MM-YYYY')}_horas_de_trabajo.xlsx`;
        link.click();
    };

    const columns = [
        {
            accessorKey: 'id',
            header: 'ID',
            enableResizing: false,
            size: 100,
        },
        {
            accessorKey: 'teacher.user.name',
            header: 'DOCENTE',
            cell: ({ row }) => {
                const name = row?.original?.teacher?.user?.name;
                const dni = row?.original?.teacher?.user?.dni;
                return <Box component={'div'} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.80rem', lineHeight: '1.2', whiteSpace: 'nowrap' }}>
                        {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: '1.2', whiteSpace: 'nowrap' }}>
                        {dni}
                    </Typography>
                </Box>
            },
            enableResizing: false,
            size: 200,
        },
        {
            accessorKey: 'estado',
            header: 'ESTADO',
            cell: ({ row }) => {
                const estado = row?.original?.estado;
                return <Chip size="medium" variant="filled" sx={{ borderRadius: 1 }} label={
                    estado === "PENDING" ? "PENDIENTE" : estado === "ACCEPTED" ? "CONFORME" : "INCONFORME"
                } color={estado === "PENDING" ? "warning" : estado === "ACCEPTED" ? "success" : "error"} />;
            },
        },
        {
            accessorKey: 'semana',
            header: 'SEMANA',
            cell: ({ row }) => {
                const semana = row?.original?.semana;
                return <Typography fontSize={'0.75rem'}>{`SEMANA ${semana}`}</Typography>;
            },
            enableResizing: false,
        },
        {
            accessorKey: 'dia',
            header: 'DIA',
            cell: ({ row }) => {
                const dia = row?.original?.dia;
                return <Typography fontSize={'0.75rem'}>{dia}</Typography>;
            },
            enableResizing: false,
        },
        {
            accessorKey: 'fecha',
            header: 'FECHA',
            cell: ({ row }) => {
                const fecha = row?.original?.fecha;
                return <Typography fontSize={'0.75rem'}>{moment.utc(fecha).format("DD/MM/YYYY")}</Typography>
            },
            enableResizing: false,
        },
        {
            accessorKey: 'turno',
            header: 'TURNO',
            cell: ({ row }) => {
                const turno = row?.original?.turno;
                return <Typography fontSize={'0.75rem'} noWrap>{turno}</Typography>;
            },
        },
        {
            accessorKey: 'local',
            header: 'LOCAL',
            cell: ({ row }) => {
                const local = row?.original?.local;
                return <Typography fontSize={'0.75rem'} noWrap>{local}</Typography>;
            },
            enableResizing: false,
        },
        {
            accessorKey: 'grupo',
            header: 'GRUPO',
        },
        {
            accessorKey: 'ingreso',
            header: 'INGRESO',
        },
        {
            accessorKey: 'salida',
            header: 'SALIDA',
        },
        {
            accessorKey: 'horasFijas',
            header: 'HORAS FIJAS',
            cell: ({ row }) => {
                const horasFijas = row?.original?.horasFijas;
                if (horasFijas?.includes(":")) {
                    return <Typography fontSize={'0.75rem'}>{moment(horasFijas, "HH:mm").format("HH")}h:{moment(horasFijas, "HH:mm").format("mm")}min</Typography>;
                } else {
                    return <Typography fontSize={'0.75rem'}>{horasFijas}min</Typography>;
                }
            },
        },
        {
            accessorKey: 'tardanza',
            header: 'TARDANZA',
            cell: ({ row }) => {
                const tardanza = row?.original?.tardanza;
                if (tardanza) {
                    if (tardanza.includes(":")) {
                        return <Typography fontSize={'0.75rem'}>{moment(tardanza, "HH:mm").format("HH")}h:{moment(tardanza, "HH:mm").format("mm")}min</Typography>;
                    } else {
                        return <Typography fontSize={'0.75rem'}>{tardanza}min</Typography>;
                    }
                }
                return null;
            },
        },
        {
            accessorKey: 'horasDictadas',
            header: 'HORAS DICTADAS',
            cell: ({ row }) => {
                const horasDictadas = row?.original?.horasDictadas;
                if (horasDictadas?.includes(":")) {
                    return <Typography fontSize={'0.75rem'}>{moment(horasDictadas, "HH:mm").format("HH")}h:{moment(horasDictadas, "HH:mm").format("mm")}min</Typography>;
                } else {
                    return <Typography fontSize={'0.75rem'}>{horasDictadas}min</Typography>;
                }
            },
        },
        {
            accessorKey: 'tipo',
            header: 'TIPO',
            cell: ({ row }) => {
                const tipo = row?.original?.tipo;
                return <Chip size="large" variant="filled" sx={{ borderRadius: 1, color: 'white' }} label={tipo} color={tipo === "COLEGIO" ? "primary" : "secondary"} />;
            },
            enableResizing: false,
        },
        {
            header: "ACCIONES",
            accessorKey: "actions",
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
                    {role !== 'SUPERVISOR' && (
                        <>
                            <WorkHourEditModal data={row.original} />
                            <DeleteConfirmDialog
                                title="Eliminar Hora de Trabajo"
                                description={`¿Estás seguro que deseas eliminar la hora de trabajo de ${row?.original?.teacher?.user?.name}?`}
                                onConfirm={() => handleDelete(row?.original?.id)}
                                renderTrigger={(open) => (
                                    <IconButton onClick={open} color="error">
                                        <DeleteOutline size={24} />
                                    </IconButton>
                                )}
                            />
                        </>
                    )}
                </Box>
            ),
        },

    ];

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const date = new Date();

    // meses al año que le corresponde necesito un enero-2025 y si estoy en 2026 enero 2026
    const currentYear = new Date().getFullYear();

    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        return { value: `${currentYear}-${i + 1}`, label: moment.utc(`${currentYear}-${i + 1}-01`).format('MMMM') };
    });

    const [months, setMonths] = useState(`${currentYear}-${(date.getMonth() + 1)}`);

    const handleMonthChange = (event) => {
        const selectedMonth = event.target.value;
        setMonths(selectedMonth);
    }

    return (
        <>
            <Stack direction={['column', 'row', 'row']} display={'flex'} gap={2} mb={2} alignItems={'center'} justifyContent={'space-between'}>
                <Box>
                    <Typography variant="h5" component="h1" sx={{
                        fontWeight: 700,
                    }}>
                        HORAS DE TRABAJO
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Gestiona las horas de trabajo de los docentes
                    </Typography>
                </Box>
                {role !== 'SUPERVISOR' && <WorkHourCreateModal />}
            </Stack>
            <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <ToggleButtonGroup
                        color="primary"
                        fullWidth
                        orientation={isMobile ? "vertical" : "horizontal"}
                        size="small"
                        value={status}
                        exclusive
                        onChange={(e) => handleSearchByStatus(e.target.value)}
                        aria-label="filtrar por estado"
                    >
                        <ToggleButton value="ALL"><AllInbox sx={{ mr: 1 }} /> TODOS</ToggleButton>
                        <ToggleButton value="PENDING"><PendingActions sx={{ mr: 1 }} /> PENDIENTES</ToggleButton>
                        <ToggleButton value="ACCEPTED"><CheckCircle sx={{ mr: 1 }} /> CONFORMES</ToggleButton>
                        <ToggleButton value="REJECTED"><Cancel sx={{ mr: 1 }} /> INCONFORMES</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Box>

            <DataTableAPI
                data={workHours}
                columns={columns}
                isLoading={isLoading}
                enableExport={true}
                onExportCSV={handleExportCSV}
                onExportExcel={handleExportExcel}
                enableColumnSelector={true}
                enableFullscreen={true}
                enableRefresh={true}
                enableColumnOrdering={true}
                enableColumnPinning={true}
                onRefresh={handleRefresh}
                stickyActions={true}
                actionsColumnId="actions"
                page={page}
                limit={limit}
                search={search}
                onSearchChange={handleSearchChange}
                onPageChange={handlePageChange}
                totalPages={totalPages}
                totalItems={totalItems}
                rowsPerPage={limit}
                currentPage={page}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{
                    '& .MuiDataGrid-cell': {
                        py: 1.5
                    }
                }}
            />

        </>
    );
};

export default WorkHours;