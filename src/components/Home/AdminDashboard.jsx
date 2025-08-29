import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, CircularProgress, Alert,
    Chip, useTheme,
    Stack, Avatar, LinearProgress, Paper
} from '@mui/material';
import {
    People as PeopleIcon,
    School as SchoolIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckIcon,
    BarChart as ChartIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminDashboard } from '../../features/reportSlice';

const AdminDashboard = () => {
    const [error, setError] = useState(null);
    const theme = useTheme();
    const dispatch = useDispatch();
    const { adminDashboard, isAdminDashboardLoading } = useSelector((state) => state.report);

    useEffect(() => {
        dispatch(getAdminDashboard());
    }, [dispatch]);

    // Colores para gráficos
    const ROLE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];
    const STATUS_COLORS = {
        'PENDING': '#ff9800',
        'IN_REVIEW': '#2196f3',
        'RESOLVED': '#4caf50'
    };

    const MetricCard = ({ title, value, subtitle, icon, color = 'primary', trend }) => (
        <Card elevation={3} sx={{
            height: '100%',
            width: '100%',
            background: `linear-gradient(135deg, ${theme.palette[color].light}15, ${theme.palette[color].main}08)`,
            border: `1px solid ${theme.palette[color].light}30`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8]
            }
        }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Stack sx={{ width: '100%' }} direction="row" gap={2} spacing={2} alignItems="center" justifyContent="space-between">
                    <Stack spacing={1} gap={1} sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                            {title}
                        </Typography>
                        <Stack direction="row" alignItems="baseline" spacing={1}>
                            <Typography variant="h4" component="div" color={color} fontWeight="bold">
                                {value}
                            </Typography>
                            {trend && (
                                <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
                                    {trend > 0 ? '+' : ''}{trend}%
                                </Typography>
                            )}
                        </Stack>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Stack>
                    <Avatar sx={{
                        bgcolor: `${theme.palette[color].main}20`,
                        color: theme.palette[color].main,
                        width: 56,
                        height: 56
                    }}>
                        {icon}
                    </Avatar>
                </Stack>
            </CardContent>
        </Card>
    );

    const StatCard = ({ title, items, color = 'primary' }) => (
        <Card elevation={3} sx={{ height: '100%', width: '100%' }}>
            <CardContent sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom color={color} fontWeight={600} sx={{ mb: 2 }}>
                    {title}
                </Typography>
                <Stack spacing={1} sx={{ width: '100%' }}>
                    {items.map((item, index) => (
                        <Stack key={index} direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                                {item.label}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2" fontWeight={600}>
                                    {item.value}
                                </Typography>
                                <Chip
                                    label={item.percentage ? `${item.percentage}%` : item.count}
                                    size="small"
                                    color={item.chipColor || color}
                                    variant="outlined"
                                />
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );

    const ChartCard = ({ title, children, height = 300 }) => (
        <Card elevation={3} sx={{ height: '100%', width: '100%' }}>
            <CardContent sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight={600} sx={{ mb: 2 }}>
                    <ChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {title}
                </Typography>
                <Box height={height}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );

    const RankingCard = ({ teachers }) => (
        <Card elevation={3} sx={{ width: '100%' }}>
            <CardContent sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight={600} sx={{ mb: 2 }}>
                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Top Docentes por Horas
                </Typography>
                <Stack spacing={1} sx={{ width: '100%' }}>
                    {teachers.slice(0, 6).map((teacher, index) => (
                        <Paper
                            key={teacher.teacherId}
                            elevation={1}
                            sx={{
                                p: 2
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{
                                    bgcolor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : theme.palette.grey[300],
                                    color: index < 3 ? '#000' : '#666',
                                    width: 40,
                                    height: 40,
                                    fontWeight: 'bold'
                                }}>
                                    {index + 1}
                                </Avatar>

                                <Stack sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {teacher.name}
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Typography variant="caption" color="text.secondary">
                                            {teacher.totalHours} hrs totales
                                        </Typography>
                                        <Typography variant="caption" color="success.main">
                                            {teacher.acceptedHours} hrs aceptadas
                                        </Typography>
                                    </Stack>
                                </Stack>

                                <Stack alignItems="flex-end" spacing={0.5}>
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        {teacher.averageHoursPerRecord}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        hrs/registro
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Box sx={{ mt: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min((teacher.acceptedHours / teacher.totalHours) * 100, 100)}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: theme.palette.grey[200],
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 3,
                                            bgcolor: theme.palette.success.main
                                        }
                                    }}
                                />
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );

    if (isAdminDashboardLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" color="text.secondary">
                        Cargando dashboard...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!adminDashboard?.summary) {
        return (
            <Box p={3}>
                <Alert severity="info">No hay datos disponibles</Alert>
            </Box>
        );
    }

    const { summary, charts } = adminDashboard;

    return (
        <Box>
            {/* Métricas principales */}
            <Stack direction={["column", "column", "row"]} gap={2} mb={3}>
                <MetricCard
                    title="Total Usuarios"
                    value={summary.users.total}
                    subtitle={`${summary.users.activePercentage}% activos`}
                    icon={<PeopleIcon fontSize="large" />}
                    color="primary"
                />
                <MetricCard
                    title="Docentes"
                    value={summary.users.teachers}
                    subtitle="Personal académico"
                    icon={<SchoolIcon fontSize="large" />}
                    color="secondary"
                />
                <MetricCard
                    title="Usuarios Activos"
                    value={summary.users.active}
                    subtitle="En el sistema"
                    icon={<CheckIcon fontSize="large" />}
                    color="success"
                />
            </Stack>

            {/* Gráficos de distribución */}
            <Stack direction={["column", "column", "row"]} gap={2} mb={3}>
                <ChartCard title="Distribución por Roles">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={charts?.usersRole || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ role, percentage }) => `${role}: ${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {(charts?.usersRole || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Estado de Reclamos">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={charts?.claimsStatus || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ status, percentage }) => `${status}: ${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {(charts?.claimsStatus || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#8884d8'} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </Stack>

            {/* Estadísticas detalladas */}
            <Stack direction={["column", "column", "row"]} gap={2} mb={3}>
                <StatCard
                    title="Horas por Estado"
                    color="info"
                    items={[
                        {
                            label: "Pendientes",
                            value: summary.workHours.byStatus.pending,
                            count: summary.workHours.byStatus.pending,
                            chipColor: "warning"
                        },
                        {
                            label: "Aceptadas",
                            value: summary.workHours.byStatus.accepted,
                            count: summary.workHours.byStatus.accepted,
                            chipColor: "success"
                        },
                        {
                            label: "Rechazadas",
                            value: summary.workHours.byStatus.rejected,
                            count: summary.workHours.byStatus.rejected,
                            chipColor: "error"
                        }
                    ]}
                />

                <StatCard
                    title="Tipos de Trabajo"
                    color="secondary"
                    items={[
                        {
                            label: "Colegio",
                            value: summary.workHours.byType.colegio,
                            count: summary.workHours.byType.colegio,
                            chipColor: "primary"
                        },
                        {
                            label: "Academia",
                            value: summary.workHours.byType.academia,
                            count: summary.workHours.byType.academia,
                            chipColor: "secondary"
                        }
                    ]}
                />

                <StatCard
                    title="Reclamos por Estado"
                    color="warning"
                    items={Object.entries(summary.claims.byStatus || {}).map(([status, count]) => ({
                        label: status === 'pending' ? 'Pendientes' :
                            status === 'in_review' ? 'En Revisión' : 'Resueltos',
                        value: count,
                        count: count,
                        chipColor: status === 'pending' ? 'warning' :
                            status === 'in_review' ? 'info' : 'success'
                    }))}
                />
            </Stack>

            {/* Ranking de docentes */}
            {/* <Stack spacing={2}>
                <RankingCard teachers={rankings?.topTeachers || []} />
            </Stack> */}
        </Box>
    );
};

export default AdminDashboard;