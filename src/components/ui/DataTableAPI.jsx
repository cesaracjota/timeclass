// IMPORTACIONES
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  TextField, IconButton, Typography, Toolbar, Tooltip, CircularProgress, Box, Select,
  MenuItem, Skeleton, FormControl, Switch, FormControlLabel, Button, Fade, useTheme,
  Divider, Menu, Badge, Stack, useColorScheme
} from '@mui/material';
import {
  ChevronDown, ChevronUp, DownloadCloud, RefreshCw
} from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  ClearAll, FullscreenExitRounded, Download, Search, ViewColumn, Fullscreen, Clear
} from '@mui/icons-material';

const TableRowSkeleton = ({ columns }) => (
  <TableRow>
    {columns.map((_, index) => (
      <TableCell key={index}>
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} animation="wave" />
      </TableCell>
    ))}
  </TableRow>
);

const ColumnSelector = ({ table }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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
              label={<Typography variant="body2">{column.columnDef.header || column.id}</Typography>}
              sx={{ m: 0, width: '100%' }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default function DataTableAPI({
  data,
  columns,
  isLoading,
  onRefresh,
  onExportCSV,
  onExportExcel,
  enableExport = false,
  enableRefresh = true,
  enableColumnSelector = true,
  enableFullscreen = true,
  enableHiding = true,  
  skeletonRows = 5,
  stickyActions = false,
  actionsColumnId = 'actions',
  title,
  noDataMessage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSearchChange,
  totalItems,
  currentPage,
}) {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [density, setDensity] = useState('comfortable');
  const [fullscreen, setFullscreen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const table = useReactTable({
    data: data || [],
    columns,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: false,
    maxMultiSortColCount: 1,
    manualExpanding: true,
    manualGrouping: true,
    manualRowSelection: true,
    manualColumnOrdering: true,
    manualColumnPinning: true,
    manualColumnVisibility: true,
    manualColumnResizing: true,
    manualColumnHiding: true,
    pageCount: totalPages,
    state: { globalFilter, sorting },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleRefresh = async () => {
    if (onRefresh && !refreshing) {
      setRefreshing(true);
      try { await onRefresh(); } finally { setRefreshing(false); }
    }
  };

  const handleExportCSV = () => {
    onExportCSV(table.getFilteredRowModel().rows);
    setAnchorEl(null);
  };

  const handleExportExcel = () => {
    onExportExcel(table.getFilteredRowModel().rows);
    setAnchorEl(null);
  };

  const clearFilters = () => {
    setGlobalFilter('');
    onSearchChange('');
    setSorting([]);
    table.resetColumnFilters();
  };

  const isStickyColumn = (columnId) => stickyActions && columnId === actionsColumnId;
  const getStickyStyles = (columnId) => isStickyColumn(columnId)
    ? {
      position: 'sticky',
      right: 0,
      borderLeft: `1px solid ${theme.palette.divider}`,
      backgroundColor: colorScheme.mode === 'dark' ? "#1e1e1e" : theme.palette.background.paper,
      boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
    }
    : {};

  const rows = table.getRowModel().rows;
  const hasFilters = globalFilter || sorting.length > 0;
  const skeletonArray = useMemo(() => Array.from({ length: skeletonRows }), [skeletonRows]);

  return (
    <Paper elevation={1} sx={{
      width: '100%', height: fullscreen ? '100vh' : 'auto',
      position: fullscreen ? 'fixed' : 'relative',
      top: fullscreen ? 0 : 'auto', left: fullscreen ? 0 : 'auto',
      zIndex: fullscreen ? theme.zIndex.modal : 'auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 }, justifyContent: 'space-between' }}>
          <Stack py={2} direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center" width="100%">
            {title && <Typography variant="h6">{title}</Typography>}
            <TextField
              fullWidth size="small" variant="outlined"
              label="Buscar en todos los campos..."
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                onSearchChange(e.target.value);
              }}
            />
            <Stack direction="row" gap={1} alignItems="center">
              {enableColumnSelector && <ColumnSelector table={table} enableHiding={enableHiding} />}
              <Tooltip title="Densidad">
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={density}
                    onChange={(e) => setDensity(e.target.value)}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="comfortable">Cómoda</MenuItem>
                    <MenuItem value="compact">Compacta</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>
              {hasFilters && (
                <IconButton onClick={clearFilters} color="error" size="small">
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
                      {refreshing ? <CircularProgress size={20} /> : <RefreshCw size={20} />}
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {enableExport && (
                <>
                  <IconButton color="primary" onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Download size={20} />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <Stack direction="column" alignItems="flex-start" justifyContent="flex-start" gap={1} p={1} width={'100%'}>
                      {
                        onExportCSV && (
                          <Tooltip title="EXPORTAR DATOS EN CSV">
                            <Button startIcon={<DownloadCloud size={20} />} onClick={handleExportCSV} fullWidth variant="outlined">
                              EXPORTAR EN CSV
                            </Button>
                          </Tooltip>
                        )}
                      <Divider />
                      {
                        onExportExcel && (
                          <Tooltip title="EXPORTAR DATOS EN EXCEL">
                            <Button startIcon={<DownloadCloud size={20} />} onClick={handleExportExcel} fullWidth variant="outlined">
                              EXPORTAR EN EXCEL
                            </Button>
                          </Tooltip>
                        )}
                    </Stack>
                  </Menu>
                </>
              )}
              {enableFullscreen && (
                <Tooltip title={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
                  <IconButton onClick={() => setFullscreen(!fullscreen)} color="primary">
                    {fullscreen ? <FullscreenExitRounded size={20} /> : <Fullscreen size={20} />}
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </Toolbar>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          <Table stickyHeader size={density === 'compact' ? 'small' : 'medium'}>
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      sx={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', ...getStickyStyles(header.column.id) }}
                    >
                      <Box display="flex" alignItems="center" gap={1} fontSize={'0.80rem'} fontWeight={700}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <Box display="flex" flexDirection="column" alignItems="center">
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
            <TableBody>
              {isLoading
                ? skeletonArray.map((_, index) => (
                  <TableRowSkeleton key={index} columns={columns} />
                ))
                : rows.length > 0
                  ? rows.map((row, index) => (
                    <Fade in={true} timeout={300 + index * 50} key={row.id}>
                      <TableRow hover>
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id} sx={{ ...getStickyStyles(cell.column.id), fontSize: '0.75rem' }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    </Fade>
                  ))
                  : (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                          <Search size={24} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No se encontraron resultados
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {globalFilter
                              ? "No hay datos que coincidan con tu búsqueda."
                              : noDataMessage || "No hay datos disponibles en este momento."}
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
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={currentPage - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100, 200, 500, 1000]}
          labelRowsPerPage="Filas"
          size="small"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
          showFirstButton
          showLastButton
        />
      </Box>
    </Paper>
  );
}
