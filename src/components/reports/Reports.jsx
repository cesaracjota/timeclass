import { 
    Autocomplete, 
    Button, 
    Chip, 
    CircularProgress, 
    debounce, 
    Divider, 
    MenuItem, 
    Stack, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    TextField, 
    Typography,
    Paper,
    Box,
    Alert,
    Skeleton,
    TableContainer,
    TablePagination,
    IconButton,
    Tooltip,
    Card,
    CardContent,
    Grid,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    Collapse,
    TableSortLabel
} from '@mui/material';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { searchTeacher } from '../../features/teacherSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { getWorkHourkByTeacherIdAndRangeDate } from '../../features/reportSlice';
import moment from 'moment';
import { Calendar, CheckCircle, Clock, Download, Search, TrendingUp } from 'lucide-react';
import { Cancel, FilterList, Person, Visibility } from '@mui/icons-material';

const Reports = () => {
    const [search, setSearch] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [orderBy, setOrderBy] = useState('fecha');
    const [order, setOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const { reportes = [], reportesLoading, error } = useSelector((state) => state.report);
    const dispatch = useDispatch();

    const initialValues = {
        teacherId: "",
        teacherData: null,
        semana: "all",
        fechaDesde: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        fechaHasta: moment().format('YYYY-MM-DD'),
    };

    const schema = Yup.object({
        teacherId: Yup.string().required("Debe seleccionar un docente"),
        fechaDesde: Yup.date()
            .required("Fecha desde es requerida")
            .max(new Date(), "La fecha no puede ser futura"),
        fechaHasta: Yup.date()
            .required("Fecha hasta es requerida")
            .min(Yup.ref('fechaDesde'), "La fecha hasta debe ser posterior a la fecha desde")
            .max(new Date(), "La fecha no puede ser futura"),
    });

    // Estadísticas calculadas
    const statistics = useMemo(() => {
        if (!reportes.length) return null;
        
        const total = reportes.length;
        const pending = reportes.filter(r => r.estado === 'PENDING').length;
        const accepted = reportes.filter(r => r.estado === 'ACCEPTED').length;
        const rejected = reportes.filter(r => r.estado === 'REJECTED').length;
        
        return {
            total,
            pending,
            accepted,
            rejected,
            pendingPercentage: ((pending / total) * 100).toFixed(1),
            acceptedPercentage: ((accepted / total) * 100).toFixed(1),
            rejectedPercentage: ((rejected / total) * 100).toFixed(1)
        };
    }, [reportes]);

    // Datos filtrados y ordenados
    const filteredAndSortedReports = useMemo(() => {
        let filtered = [...reportes];
        
        // Aplicar filtro de estado
        if (statusFilter !== 'all') {
            filtered = filtered.filter(report => report.estado === statusFilter);
        }
        
        // Aplicar ordenamiento
        filtered.sort((a, b) => {
            let aValue = a[orderBy];
            let bValue = b[orderBy];
            
            if (orderBy === 'fecha') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            if (order === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
        
        return filtered;
    }, [reportes, statusFilter, order, orderBy]);

    // Datos paginados
    const paginatedReports = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredAndSortedReports.slice(start, start + rowsPerPage);
    }, [filteredAndSortedReports, page, rowsPerPage]);

    const handleSubmit = (values) => {
        const data = {
            teacherId: values.teacherId,
            semana: values.semana,
            startDate: values.fechaDesde,
            endDate: values.fechaHasta,
        };
        setPage(0); // Reset pagination
        dispatch(getWorkHourkByTeacherIdAndRangeDate(data));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchTeachers = useCallback(
        debounce(async (value) => {
            if (!value || value.length < 2) return;
            setLoading(true);
            try {
                const res = await dispatch(searchTeacher(value));
                setTeachers(res.payload || []);
            } catch (err) {
                console.error("Error al buscar docentes:", err);
            } finally {
                setLoading(false);
            }
        }, 300),
        [dispatch]
    );

    useEffect(() => {
        if (search.length >= 2) {
            fetchTeachers(search);
        } else {
            setTeachers([]);
        }
    }, [search, fetchTeachers]);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const exportToCSV = () => {
        if (!reportes.length) return;
        
        const headers = ['Semana', 'Fecha', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...reportes.map(item => [
                item.semana,
                moment(item.fecha).format('DD/MM/YYYY'),
                {
                    "PENDING": "PENDIENTE",
                    "ACCEPTED": "CONFORME",
                    "REJECTED": "INCONFORME",
                }[item.estado]
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reportes_${moment().format('YYYY-MM-DD')}.csv`;
        link.click();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return <CheckCircle size={16} />;
            case 'REJECTED':
                return <Cancel size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return 'success';
            case 'REJECTED':
                return 'error';
            default:
                return 'warning';
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Reportes de Horas de Trabajo
                </Typography>
            </Box>

            {/* Formulario de búsqueda */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, errors, values, touched }) => (
                        <Form>
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Filtros de Búsqueda</Typography>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <FilterList size={20} />
                                    </IconButton>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} width="100%">
                                        <Autocomplete
                                            options={teachers}
                                            getOptionLabel={(option) =>
                                                option?.user
                                                    ? `${option.user.name} (${option.user.dni})`
                                                    : ""
                                            }
                                            size="small"
                                            fullWidth
                                            loading={loading}
                                            isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                                            onChange={(_, value) => {
                                                setFieldValue("teacherId", value ? value.id : "");
                                                setFieldValue("teacherData", value);
                                            }}
                                            renderOption={(props, option) => (
                                                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32 }}>
                                                        {option.user.name.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {option.user.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            DNI: {option.user.dni}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Buscar docente"
                                                    placeholder="Ingrese nombre, apellido o DNI"
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    error={touched.teacherId && !!errors.teacherId}
                                                    helperText={touched.teacherId && errors.teacherId}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: <Search size={20} style={{ marginRight: 8, color: '#666' }} />,
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
                                    </Grid>

                                    <Grid item xs={12} md={6} width="100%">
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Semana</InputLabel>
                                            <Select
                                                value={values.semana}
                                                label="Semana"
                                                onChange={(e) => setFieldValue("semana", e.target.value)}
                                            >
                                                <MenuItem value="all">Todas las semanas</MenuItem>
                                                {[1, 2, 3, 4, 5].map((week) => (
                                                    <MenuItem key={week} value={week}>
                                                        Semana {week}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Collapse in={showFilters}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                name="fechaDesde"
                                                label="Fecha Desde"
                                                size="small"
                                                value={values.fechaDesde}
                                                onChange={(e) => setFieldValue("fechaDesde", e.target.value)}
                                                error={touched.fechaDesde && !!errors.fechaDesde}
                                                helperText={touched.fechaDesde && errors.fechaDesde}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                name="fechaHasta"
                                                label="Fecha Hasta"
                                                size="small"
                                                value={values.fechaHasta}
                                                onChange={(e) => setFieldValue("fechaHasta", e.target.value)}
                                                error={touched.fechaHasta && !!errors.fechaHasta}
                                                helperText={touched.fechaHasta && errors.fechaHasta}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Collapse>

                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    size="large"
                                    fullWidth
                                    color="primary"
                                    disabled={reportesLoading}
                                    startIcon={reportesLoading ? <CircularProgress size={20} /> : <Search size={20} />}
                                    sx={{ alignSelf: 'flex-start', minWidth: 200 }}
                                >
                                    {reportesLoading ? 'Consultando...' : 'Buscar Reportes'}
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Paper>

            {/* Información del docente seleccionado */}
            <Formik initialValues={initialValues}>
                {({ values }) => values.teacherData && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 48, height: 48 }}>
                                    {values.teacherData.user.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{values.teacherData.user.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        DNI: {values.teacherData.user.dni}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Formik>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error al cargar los reportes: {error}
                </Alert>
            )}

            {/* Estadísticas */}
            {statistics && (
                <Stack spacing={2} sx={{ mb: 3 }} direction={{ xs: 'column', sm: 'column', md: 'column', lg: 'row' }} justifyContent="space-between">
                    <Grid item xs={12} sm={6} md={3} width={'100%'}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary" gutterBottom>
                                    {statistics.total}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Reportes
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} width={'100%'}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="success.main" gutterBottom>
                                    {statistics.accepted}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Conformes ({statistics.acceptedPercentage}%)
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} width={'100%'}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="warning.main" gutterBottom>
                                    {statistics.pending}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Pendientes ({statistics.pendingPercentage}%)
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} width={'100%'}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="error.main" gutterBottom>
                                    {statistics.rejected}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Inconformes ({statistics.rejectedPercentage}%)
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Stack>
            )}

            {/* Tabla de resultados */}
            <Paper elevation={2}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp size={20} />
                        Resultados ({filteredAndSortedReports.length})
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Estado"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">Todos</MenuItem>
                                <MenuItem value="PENDING">Pendientes</MenuItem>
                                <MenuItem value="ACCEPTED">Conformes</MenuItem>
                                <MenuItem value="REJECTED">Inconformes</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <Tooltip title="Exportar a CSV">
                            <IconButton 
                                onClick={exportToCSV} 
                                disabled={!reportes.length}
                                color="primary"
                            >
                                <Download size={20} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Divider />

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    <TableSortLabel
                                        active={orderBy === 'semana'}
                                        direction={orderBy === 'semana' ? order : 'asc'}
                                        onClick={() => handleSort('semana')}
                                    >
                                        SEMANA
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    <TableSortLabel
                                        active={orderBy === 'fecha'}
                                        direction={orderBy === 'fecha' ? order : 'asc'}
                                        onClick={() => handleSort('fecha')}
                                    >
                                        FECHA
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>ESTADO</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reportesLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton /></TableCell>
                                        <TableCell><Skeleton /></TableCell>
                                        <TableCell><Skeleton /></TableCell>
                                        <TableCell><Skeleton /></TableCell>
                                    </TableRow>
                                ))
                            ) : paginatedReports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No se encontraron reportes con los filtros aplicados
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedReports.map((item) => (
                                    <TableRow key={item.id} hover>
                                        <TableCell>
                                            Semana {item.semana}
                                        </TableCell>
                                        <TableCell>
                                            {moment.utc(item.fecha).format("DD/MM/YYYY")}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                icon={getStatusIcon(item.estado)}
                                                label={{
                                                    "PENDING": "PENDIENTE",
                                                    "ACCEPTED": "CONFORME",
                                                    "REJECTED": "INCONFORME",
                                                }[item.estado]} 
                                                color={getStatusColor(item.estado)}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filteredAndSortedReports.length > 0 && (
                    <TablePagination
                        component="div"
                        count={filteredAndSortedReports.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) => 
                            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                        }
                    />
                )}
            </Paper>
        </Box>
    );
};

export default Reports;