import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../../features/userSlice";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Switch,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  DeleteOutline
} from "@mui/icons-material";
import { DeleteConfirmDialog } from "../ui/DeleteConfirmDialog";
import MuiDataTable from "../ui/DataTable";
import UserCreateModal from "./UserCreateModal";
import UserEditModal from "./UserEditModal";
import { BookUserIcon, UserCog2, UserSearchIcon } from "lucide-react";

// Configuración de columnas usando TanStack
const columnHelper = createColumnHelper();

// Componente principal
const Users = () => {
  const { users = [], isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Función de refresh
  const handleRefresh = async () => {
    await dispatch(getAllUsers());
  };

  // Función de exportación
  const handleExport = (filteredRows) => {
    const csvData = [
      ['Nombre', 'Email', 'Rol', 'Estado', 'Fecha de registro'],
      ...filteredRows.map(row => [
        row.original.name,
        row.original.email,
        row.original.role,
        row.original.status,
        new Date(row.original.createdAt).toLocaleDateString('es-ES')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = async (userId) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  // Definición de columnas con TanStack
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Usuario',
      cell: ({ row }) => {
        const user = row.original;
        const fullName = user?.name || 'Sin nombre';
        const dni = user?.dni || 'Sin DNI';


        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                fontWeight: 900,
                fontSize: 12,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              {fullName.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle2"
              >
                {fullName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {dni}
              </Typography>
            </Box>
          </Stack>
        );
      },
    }),
    columnHelper.accessor('role', {
      header: 'Rol',
      cell: ({ getValue }) => {
        const value = getValue();
        const roleKey = value;
    
        const roleConfig = {
          ADMIN: {
            label: 'ADMINISTRADOR',
            color: theme.palette.error.main,
            bg: alpha(theme.palette.error.main, 0.1),
            icon: <UserCog2 fontSize="small" />,
          },
          TEACHER: {
            label: 'DOCENTE',
            color: theme.palette.primary.main,
            bg: alpha(theme.palette.primary.main, 0.1),
            icon: <BookUserIcon fontSize="small" />,
          },
          SECRETARY: {
            label: 'SECRETARI(A)',
            color: theme.palette.warning.main,
            bg: alpha(theme.palette.warning.main, 0.1),
            icon: <UserSearchIcon fontSize="small" />,
          },
          SUPERVISOR: {
            label: 'SUPERVISOR',
            color: theme.palette.success.main,
            bg: alpha(theme.palette.success.main, 0.1),
            icon: <UserSearchIcon fontSize="small" />,
          },
        };
    
        const config = roleConfig[roleKey] || roleConfig.user;

        return (
          <Chip
            icon={config?.icon}
            label={
              <Box component="span">
                {config?.label}
              </Box>
            }
            size="medium"
            sx={{
              borderRadius: '999px',
              fontWeight: 500,
              backgroundColor: config?.bg,
              color: config?.color,
              borderColor: config?.color,
              borderWidth: 1,
              borderStyle: 'solid',
              textTransform: 'capitalize',
              '& .MuiChip-icon': {
                color: config?.color,
              },
            }}
            variant="outlined"
          />
        );
      },
      size: 150,
    }),
    columnHelper.accessor('passwordChanged', {
      header: 'CONTRASEÑA CAMBIADA',
      cell: ({ getValue }) => {
        const value = getValue();
        return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
          <Switch checked={value} disabled />
          <Typography variant="body2" color="text.secondary">
            {value ? 'SI' : 'NO'}
          </Typography>
        </Box>;
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Fecha de registro',
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        return (
          <Typography variant="body2" color="text.secondary">
            {date.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        );
      },
      size: 180,
    }),
    columnHelper.accessor('id', {
      header: 'Acciones',
      cell: ({ getValue, row }) => {
        const userId = getValue();
        const user = row.original;
        return (
          <Stack direction="row" alignItems="center" gap={1}>
            <UserEditModal user={user} />
            <DeleteConfirmDialog
              title="Eliminar Usuario"
              description={`¿Estás seguro que deseas eliminar a ${user.name}?`}
              onConfirm={() => handleDelete(userId)}
              renderTrigger={(open) => (
                <IconButton onClick={open} color="error">
                  <DeleteOutline size={24} />
                </IconButton>
              )}
            />
          </Stack>
        );
      },
      enableSorting: false,
      maxSize: 100,
      enableColumnFilter: false,
    }),
  ], [handleDelete, theme.palette]);

  return (
    <>
      <Stack direction={['column', 'row', 'row']} display={'flex'} gap={2} mb={2} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Typography variant="h5" component="h1" sx={{
            fontWeight: 700,
          }}>
            USUARIOS
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona la lista de usuarios
          </Typography>
        </Box>
        <UserCreateModal />
        {/* <Button color="primary" sx={{ width: { xs: '100%', md: 'auto' } }} startIcon={<Add />} variant="contained">Agregar Nuevo Usuario</Button> */}
      </Stack>
      <MuiDataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onExport={handleExport}
        enableExport={true}
        enableRefresh={true}
        enableStats={true}           // Nuevo
        enableColumnSelector={true}  // Nuevo
        enableFullscreen={true}     // Nuevo
        skeletonRows={8}            // Nuevo
      />
    </>
  );
};

export default Users;