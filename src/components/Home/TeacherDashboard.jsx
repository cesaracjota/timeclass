import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  useColorScheme,
  Stack,
  Alert,
  IconButton,
  AlertTitle,
} from '@mui/material';
import {
  CheckCircle,
  Close,
  Percent,
} from '@mui/icons-material';
import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import 'highcharts/modules/exporting';
import moment from 'moment';
import { AlertCircle, Clock1 } from 'lucide-react';

const MetricCard = ({ title, value, subtitle, color = 'primary', trend }) => (
  <Card elevation={3} sx={{
    height: '100%',
    width: '100%',
    background: `linear-gradient(135deg, ${color.light}15, ${color.main}08)`,
    border: `1px solid ${color.light}30`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
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
      </Stack>
    </CardContent>
  </Card>
);

// Componente principal
export default function TeacherDashboard({ data, isLoading = false, closeAlert, openAlert }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme.mode === 'dark';
  // const [openAlert, setOpenAlert] = useState(true);
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="textSecondary" textAlign="center">
          No hay datos disponibles
        </Typography>
      </Box>
    );
  }

  const { summary, details } = data;
  const performance = summary?.performance || {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const workHours = details?.workHours || [];

  // Si no hay datos de trabajo, mostrar mensaje
  if (!workHours.length) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="textSecondary" textAlign="center">
          No hay registros de horas trabajadas disponibles
        </Typography>
      </Box>
    );
  }

  // 1. Gráfico de comparación diaria
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dailyComparisonData = useMemo(() => {
    const groupedData = workHours.reduce((acc, record) => {
      if (!record.fecha || !record.horasFijas || !record.horasDictadas) return acc;

      const date = moment(record.fecha).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = {
          horasFijas: 0,
          horasDictadas: 0,
          tardanzas: 0
        };
      }

      try {
        const [horasFijas, minutosFijas] = record.horasFijas.split(':').map(Number);
        acc[date].horasFijas += horasFijas + (minutosFijas / 60);

        const [horasDictadas, minutosDictadas] = record.horasDictadas.split(':').map(Number);
        acc[date].horasDictadas += horasDictadas + (minutosDictadas / 60);

        if (record.tardanza) {
          const [horasTardanza, minutosTardanza] = record.tardanza.split(':').map(Number);
          acc[date].tardanzas += horasTardanza + (minutosTardanza / 60);
        }
      } catch (error) {
        console.error('Error procesando registro:', record, error);
      }

      return acc;
    }, {});

    // Ordenar fechas y filtrar los últimos 30 días
    let allDates = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
    if (allDates.length > 30) {
      allDates = allDates.slice(-30);
    }

    // Convertir fechas a formato DD/MM para mostrar en el gráfico
    const displayDates = allDates.map(date => moment(date).format('DD/MM'));

    // Mapear los datos filtrados
    const filteredData = {};
    allDates.forEach(date => {
      filteredData[moment(date).format('DD/MM')] = groupedData[date];
    });

    return {
      dates: displayDates,
      data: filteredData
    };
  }, [workHours]);

  // 2. Gráfico de distribución por tipo (Colegio/Academia)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const typeDistributionData = useMemo(() => {
    const distribution = workHours.reduce((acc, record) => {
      if (!record.tipo || !record.horasDictadas) return acc;

      const tipo = record.tipo || 'NO ESPECIFICADO';
      if (!acc[tipo]) {
        acc[tipo] = {
          horas: 0,
          count: 0
        };
      }

      try {
        const [horas, minutos] = record.horasDictadas.split(':').map(Number);
        acc[tipo].horas += horas + (minutos / 60);
        acc[tipo].count += 1;
      } catch (error) {
        console.error('Error procesando registro:', record, error);
      }

      return acc;
    }, {});

    return {
      categories: Object.keys(distribution),
      data: Object.values(distribution).map(d => d.horas)
    };
  }, [workHours]);

  // 3. Gráfico de tardanzas por día
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tardanzasData = useMemo(() => {
    return {
      dates: dailyComparisonData.dates,
      data: dailyComparisonData.dates.map(date => dailyComparisonData.data[date].tardanzas)
    };
  }, [dailyComparisonData]);

  // Configuración común para los gráficos
  const commonChartOptions = {
    chart: {
      zoomType: 'x',
      panning: true,
      panKey: 'shift',
      height: 400,
      style: {
        fontFamily: 'inherit'
      },
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'
    },
    title: {
      style: {
        color: isDarkMode ? '#ffffff' : '#000000',
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      labels: {
        style: {
          color: isDarkMode ? '#ffffff' : '#000000',
          fontSize: '12px'
        }
      },
      gridLineColor: isDarkMode ? '#333333' : '#e0e0e0'
    },
    yAxis: {
      labels: {
        style: {
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      },
      gridLineColor: isDarkMode ? '#333333' : '#e0e0e0'
    },
    legend: {
      itemStyle: {
        color: isDarkMode ? '#ffffff' : '#000000'
      }
    },
    tooltip: {
      backgroundColor: isDarkMode ? '#333333' : '#ffffff',
      style: {
        color: isDarkMode ? '#ffffff' : '#000000'
      }
    },
    exporting: {
      enabled: true,
    }
  };

  // Configuración de los gráficos
  const dailyComparisonOptions = {
    ...commonChartOptions,
    title: {
      ...commonChartOptions.title,
      text: 'COMPARACIÓN DE HORAS FIJAS VS DICTADAS POR DÍA'
    },
    xAxis: {
      ...commonChartOptions.xAxis,
      categories: dailyComparisonData.dates,
      title: { text: 'Fecha' }
    },
    yAxis: {
      ...commonChartOptions.yAxis,
      title: { text: 'Horas' },
      labels: {
        formatter: function () {
          return this.value + 'h';
        }
      }
    },
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: function () {
        const hours = Math.floor(this.y);
        const minutes = Math.round((this.y - hours) * 60);
        return `<b>${this.series.name}</b><br/>${hours}h ${minutes}min`;
      }
    },
    series: [
      {
        name: 'Horas Fijas',
        data: dailyComparisonData.dates.map(date => dailyComparisonData.data[date].horasFijas),
        color: '#1976d2',
        lineWidth: 2,
        dashStyle: 'shortdash'
      },
      {
        name: 'Horas Dictadas',
        data: dailyComparisonData.dates.map(date => dailyComparisonData.data[date].horasDictadas),
        color: '#2e7d32',
        lineWidth: 2
      }
    ]
  };

  const typeDistributionOptions = {
    ...commonChartOptions,
    chart: {
      ...commonChartOptions.chart,
      type: 'pie'
    },
    title: {
      ...commonChartOptions.title,
      text: 'DISTRIBUCIÓN DE HORAS POR TIPO'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%'
        }
      }
    },
    series: [{
      name: 'Horas',
      colorByPoint: true,
      data: typeDistributionData.categories.map((tipo, index) => ({
        name: tipo,
        y: typeDistributionData.data[index],
        color: tipo === 'COLEGIO' ? '#1976d2' : '#2e7d32'
      }))
    }]
  };

  const tardanzasOptions = {
    ...commonChartOptions,
    title: {
      ...commonChartOptions.title,
      text: 'TARDANZAS POR DÍA'
    },
    xAxis: {
      ...commonChartOptions.xAxis,
      categories: tardanzasData.dates,
      title: { text: 'Fecha' }
    },
    yAxis: {
      ...commonChartOptions.yAxis,
      title: { text: 'Horas' },
      labels: {
        formatter: function () {
          return this.value + 'h';
        }
      }
    },
    tooltip: {
      ...commonChartOptions.tooltip,
      formatter: function () {
        const hours = Math.floor(this.y);
        const minutes = Math.round((this.y - hours) * 60);
        return `<b>Tardanza</b><br/>${hours}h ${minutes}min`;
      }
    },
    series: [{
      name: 'Tardanzas',
      data: tardanzasData.data,
      color: '#d32f2f',
      type: 'column'
    }]
  };

  return (
    <Box>
      {
        openAlert && (
          <Alert
            severity="error"
            display={openAlert ? 'flex' : 'none'}
            onClose={closeAlert}
            variant="standard"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="medium"
                onClick={closeAlert}
              >
                <Close fontSize='30' />
              </IconButton>
            }
            sx={{ mb: 4 }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>ESTIMADO DOCENTE IMPORTANTE</AlertTitle>
            Recuerda dar la conformidad correspondiente a sus horas trabajadas. De lo contrario, no se considerarán para el cálculo de tu remuneración.
          </Alert>
        )
      }
      
      <Typography variant="h5" color="textSecondary" mb={2} textAlign={'center'} fontWeight={500}>
        BIENVENIDO(A) <strong>{summary?.teacher?.name}</strong> A TU PANEL DE CONTROL
      </Typography>

      <Stack direction={["column", "column", "column", "row"]} gap={3} sx={{ mb: 4 }}>
        <Box flexBasis="100%">
          <MetricCard
            title="Horas Totales"
            value={performance.totalHours || "00:00"}
            icon={Clock1}
            color="primary"
          />
        </Box>
        <Box flexBasis="100%">
          <MetricCard
            title="Horas Aceptadas"
            value={performance.acceptedHours || "00:00"}
            icon={CheckCircle}
            color="success"
          />
        </Box>
        <Box flexBasis="100%">
          <MetricCard
            title="Tasa de Cumplimiento"
            value={`${performance.completionRate || "0"}%`}
            icon={Percent}
            color="info"
          />
        </Box>
        <Box flexBasis="100%">
          <MetricCard
            title="Tardanzas Totales"
            value={performance.totalTardanzas || "00:00"}
            icon={AlertCircle}
            color="error"
          />
        </Box>
      </Stack>
      <Stack direction={'column'} spacing={3}>
        <Box flexBasis="100%">
          <Card>
            <CardContent>
              <HighchartsReact
                highcharts={Highcharts}
                options={dailyComparisonOptions}
              />
            </CardContent>
          </Card>
        </Box>
        <Box flexBasis="100%">
          <Card>
            <CardContent>
              <HighchartsReact
                highcharts={Highcharts}
                options={typeDistributionOptions}
              />
            </CardContent>
          </Card>
        </Box>
        <Box flexBasis="100%">
          <Card>
            <CardContent>
              <HighchartsReact
                highcharts={Highcharts}
                options={tardanzasOptions}
              />
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}

