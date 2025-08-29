import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  IconButton,
  Stack
} from "@mui/material";
import { deleteTeacher, getAllTeachers } from "../../features/teacherSlice";
import { DeleteConfirmDialog } from "../ui/DeleteConfirmDialog";
import { DeleteOutline } from "@mui/icons-material";
import TeacherEditModal from "./TeacherEditModal";
import UserCreateModal from "../users/UserCreateModal";
import TeacherWorkHourHistorialModal from "./TeacherWorkHourHistorialModal";
import DataTableTeacher from "./DataTableTeacher";
import * as ExcelJS from 'exceljs';

const Teachers = () => {
  const { teachers, isLoading } = useSelector((state) => state.teacher);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(getAllTeachers());
  }, [dispatch]);

  const columnHelper = createColumnHelper();

  const handleDelete = async (userId) => {
    try {
      await dispatch(deleteTeacher(userId)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = async () => {
    try {
      await dispatch(getAllTeachers()).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = async (filteredRows) => {
    const csvData = [
      ['DOCENTE', 'DNI', 'CORREO', 'CATEGORÍA', 'TIPO DE CONTRATO'],
      ...filteredRows.map(row => [
        row.original.user.name,
        row.original.user.dni,
        row.original.user.email,
        row.original.category,
        row.original.contractType,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); 
    link.href = URL.createObjectURL(blob);
    link.download = `DOCENTES_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportExcel = async (filteredRows) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DOCENTES');
    
    worksheet.columns = [
      { header: 'DOCENTE', key: 'name' },
      { header: 'DNI', key: 'dni' },
      { header: 'CORREO', key: 'email' },
      { header: 'CATEGORÍA', key: 'category' },
      { header: 'TIPO DE CONTRATO', key: 'contractType' },
    ];

    filteredRows.forEach(row => {
      worksheet.addRow({
        name: row.original.user.name,
        dni: row.original.user.dni,
        email: row.original.user.email,
        category: row.original.category,
        contractType: row.original.contractType,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `DOCENTES_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
  };

  const columns = [
    columnHelper.accessor("user", {
      header: "Datos Generales",
      size: 200,
      cell: ({ row }) => {
        const user = row?.original?.user;
        const name = user?.name;
        const dni = user?.dni;

        return (
          <Box component={'div'} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              bgcolor: theme.palette.primary.main,
              width: 32,
              height: 32,
              fontSize: '0.875rem',
              color: 'white'
            }}>
              {name ? name[0]?.toUpperCase() : ""}
            </Avatar>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                DNI: {dni}
              </Typography>
            </Box>
          </Box>
        );
      },
    }),
    {
      header: "Correo",
      size: 200,
      cell: ({ row }) => {
        const user = row?.original?.user;
        const email = user?.email;
        return (
          <Typography variant="body2">
            {email}
          </Typography>
        );
      },
    },
    {
      header: "Acciones",
      id: "actions",
      size: 150,
      cell: ({ row }) => (
        <Box component={'div'} sx={{ display: 'flex', gap: 2 }}>
          <TeacherWorkHourHistorialModal teacherId={row.original.id} teacher={row.original} />
          <TeacherEditModal teacher={row.original} />
          <DeleteConfirmDialog
            title="ELIMINAR DOCENTE"
            description={
              <Typography variant="h6" fontWeight={400} textAlign={'center'}>
                ¿Estás seguro que deseas eliminar a <strong>{row?.original?.user?.name}</strong>?
              </Typography>
            }
            onConfirm={() => handleDelete(row?.original?.id)}
            renderTrigger={(open) => (
              <IconButton onClick={open} color="error">
                <DeleteOutline size={24} />
              </IconButton>
            )}
          />
        </Box>
      ),
    },
  ];

  return (
    <>
      <Stack direction={['column', 'row', 'row']} display={'flex'} gap={2} mb={2} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Typography variant="h5" component="h1" sx={{
            fontWeight: 700,
          }}>
            DOCENTES
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona los docentes en el sistema
          </Typography>
        </Box>
        <UserCreateModal />
      </Stack>

      <DataTableTeacher
        data={teachers}
        columns={columns}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        enableExport={true}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        sx={{
          '& .MuiDataGrid-cell': {
            py: 1.5
          }
        }}
      />
    </>
  );
};

export default Teachers;