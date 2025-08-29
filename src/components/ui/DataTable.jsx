import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  IconButton,
  Typography,
  Toolbar,
  Tooltip,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  Skeleton,
  FormControl,
  Switch,
  FormControlLabel,
  Button,
  Fade,
  useTheme,
  Divider,
  Menu,
  Badge,
  Stack,
  useColorScheme
} from '@mui/material';

import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

import { useState } from 'react';
import {
  ClearAll, FullscreenExitRounded,
  Download,
  Search,
  ViewColumn,
  Fullscreen,
  Clear,
} from '@mui/icons-material';

// Componente Skeleton personalizado para las filas
const TableRowSkeleton = ({ columns }) => (
  <TableRow>
    {columns.map((_, index) => (
      <TableCell key={index}>
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ borderRadius: 1 }}
          animation="wave"
        />
      </TableCell>
    ))}
  </TableRow>
);

// Componente para selector de columnas
const ColumnSelector = ({ table }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Seleccionar columnas">
        <IconButton onClick={handleClick}>
          <Badge
            badgeContent={table.getAllColumns().filter(col => !col.getIsVisible()).length}
            color="error"
            invisible={table.getAllColumns().every(col => col.getIsVisible())}
          >
            <ViewColumn size={20} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 200, maxHeight: 300 }
        }}
      >
        {table.getAllLeafColumns().map(column => (
          <MenuItem key={column.id} dense>
            <FormControlLabel
              control={
                <Switch
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {typeof column.columnDef.header === 'string'
                    ? column.columnDef.header
                    : column.id}
                </Typography>
              }
              sx={{ m: 0, width: '100%' }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default function DataTable({
  data,
  columns,
  isLoading,
  onRefresh,
  onExport,
  initialPageSize,
  enableExport = true,
  enableRefresh = true,
  enableColumnSelector = true,
  enableFullscreen = true,
  skeletonRows = 5,

  stickyActions = true, // Nueva prop para habilitar columnas fijas
  actionsColumnId = 'actions', // ID de la columna de acciones
}) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: initialPageSize || 10 });
  const [refreshing, setRefreshing] = useState(false);
  const [density, setDensity] = useState('comfortable');
  const [fullscreen, setFullscreen] = useState(false);

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleRefresh = async () => {
    if (onRefresh && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(table.getFilteredRowModel().rows);
    }
  };

  const clearFilters = () => {
    setGlobalFilter('');
    setSorting([]);
    table.setPageIndex(0);
    table.resetColumnFilters();
  };

  // Función para determinar si una columna debe ser sticky
  const isStickyColumn = (columnId) => {
    return stickyActions && columnId === actionsColumnId;
  };

  // Función para obtener los estilos de columna sticky
  const getStickyStyles = (columnId) => {
    if (!isStickyColumn(columnId)) return {};
    
    return {
      position: 'sticky',
      right: 0,
      borderLeft: `1px solid ${theme.palette.divider}`,
      backgroundColor: colorScheme.mode === 'dark' ? "#1e1e1e" : theme.palette.background.paper,
      boxShadow: stickyActions ? '-2px 0 4px rgba(0,0,0,0.1)' : 'none',
    };
  };

  const rows = table.getRowModel().rows;
  const hasFilters = globalFilter || sorting.length > 0;

  return (
    <Paper
      elevation={1}
      sx={{
        width: '100%',
        height: fullscreen ? '100vh' : 'auto',
        position: fullscreen ? 'fixed' : 'relative',
        top: fullscreen ? 0 : 'auto',
        left: fullscreen ? 0 : 'auto',
        zIndex: fullscreen ? theme.zIndex.modal : 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header simplificado */}
      <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Toolbar
          display={'flex'}
          width={'100%'}
          sx={{
            minHeight: { xs: 64, sm: 72 },
            justifyContent: 'space-between'
          }}
        >
          <Stack py={2} direction={["column", "row", "row"]} gap={2} alignItems="center" justifyContent={'space-between'} display={'flex'} width={'100%'}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Buscar en todos los campos..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />

            <Stack direction="row" gap={1} alignItems="center">
              {enableColumnSelector && <ColumnSelector table={table} />}

              <Tooltip title="Densidad">
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={density}
                    onChange={(e) => setDensity(e.target.value)}
                    displayEmpty
                    sx={{ '& .MuiSelect-select': { py: 1 } }}
                  >
                    <MenuItem value="comfortable">Cómoda</MenuItem>
                    <MenuItem value="compact">Compacta</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>

              {hasFilters && (
                <IconButton
                  onClick={clearFilters}
                  color="error"
                  size="small"
                >
                  <Clear size={20} />
                </IconButton>
              )}

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              {enableRefresh && (
                <Tooltip title="Refrescar datos">
                  <span>
                    <IconButton
                      onClick={handleRefresh}
                      disabled={refreshing || isLoading}
                      color="primary"
                    >
                      {refreshing ? (
                        <CircularProgress size={20} />
                      ) : (
                        <RefreshCw size={20} />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              )}

              {enableExport && (
                <Tooltip title="Exportar datos">
                  <IconButton onClick={handleExport} color="primary">
                    <Download size={20} />
                  </IconButton>
                </Tooltip>
              )}

              {enableFullscreen && (
                <Tooltip title={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                  <IconButton
                    onClick={() => setFullscreen(!fullscreen)}
                    color="primary"
                  >
                    {fullscreen ? <FullscreenExitRounded size={20} /> : <Fullscreen size={20} />}
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </Toolbar>
      </Box>

      {/* Contenido de la tabla */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          <Table stickyHeader size={density === 'compact' ? 'small' : 'medium'}>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      sx={{
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                        fontSize: { xs: '12px', md: '13px', lg: '14px' },
                        fontWeight: { xs: 600, md: 600, lg: 600 },
                        padding: { xs: 1, md: 1.5, lg: 2 },
                        backgroundColor: colorScheme.mode === 'dark' ? "#121212" : theme.palette.background.paper,
                        ...getStickyStyles(header.column.id),
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} fontSize={'0.80rem'} fontWeight={700}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <Box display="flex" flexDirection="column" alignItems="center" sx={{ opacity: 0.5 }} fontSize={'0.80rem'}>
                            {header.column.getIsSorted() === 'asc' && <ChevronUp size={16} />}
                            {header.column.getIsSorted() === 'desc' && <ChevronDown size={16} />}
                            {!header.column.getIsSorted() && (
                              <Box sx={{ opacity: 0.3 }}>
                                <ChevronUp size={14} />
                                <ChevronDown size={14} style={{ marginTop: -4 }} />
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody sx={{ fontSize: { xs: '8px', sm: '9px', md: '10px', lg: '14px' } }}>
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: skeletonRows }).map((_, index) => (
                  <TableRowSkeleton key={index} columns={columns} />
                ))
              ) : rows.length > 0 ? (
                rows.map((row, index) => (
                  <Fade in={true} timeout={300 + index * 50} key={row.id}>
                    <TableRow
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id}
                          sx={{
                            ...getStickyStyles(cell.column.id),
                            fontSize: '0.75rem',
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </Fade>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Search size={24} />
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No se encontraron resultados
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {globalFilter
                            ? "No hay datos que coincidan con tu búsqueda."
                            : "No hay datos disponibles en este momento."
                          }
                        </Typography>
                        {hasFilters && (
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<ClearAll />}
                            onClick={clearFilters}
                            sx={{ mt: 1 }}
                          >
                            Limpiar filtros
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={table.getFilteredRowModel().rows.length}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, newPage) => table.setPageIndex(newPage)}
          rowsPerPage={table.getState().pagination.pageSize}
          onRowsPerPageChange={(e) => {
            table.setPageSize(Number(e.target.value));
            table.setPageIndex(0);
          }}
          rowsPerPageOptions={[5, 10, 15, 25, 50, 100, 200, 500]}
          labelRowsPerPage="Filas"
          size="small"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          showFirstButton
          showLastButton
        />
      </Box>
    </Paper>
  );
}