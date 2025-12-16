// navigation.js o directamente en App.jsx

import { ListAlt } from "@mui/icons-material";
import { Clock, HomeIcon, Settings2Icon, UploadCloudIcon, User2Icon, Users2 } from "lucide-react";

export const navigation = [
    {
        segment: '',
        title: 'INICIO',
        icon: <HomeIcon />,
        allowedRoles: ['ADMIN', 'TEACHER', 'SUPERVISOR'],
    },
    {
        segment: 'users',
        title: 'USUARIO',
        icon: <User2Icon />,
        allowedRoles: ['ADMIN', 'SUPERVISOR'], // solo admin puede ver esto
        children: [
            {
                segment: 'list',
                title: 'LISTAR USUARIOS',
                icon: <Users2 />,
                allowedRoles: ['ADMIN', 'SUPERVISOR'],
            },
        ],
    },
    {
        segment: 'teachers',
        title: 'DOCENTE',
        icon: <User2Icon />,
        allowedRoles: ['ADMIN', 'SUPERVISOR'],
        children: [
            {
                segment: 'list',
                title: 'LISTAR DOCENTES',
                icon: <Users2 />,
                allowedRoles: ['ADMIN', 'SUPERVISOR'],
            },
            {
                segment: 'upload',
                title: 'IMPORTAR DOCENTES',
                icon: <UploadCloudIcon />,
                allowedRoles: ['ADMIN'],
            },
        ],
    },
    {
        segment: 'work-hours',
        title: 'HORAS',
        icon: <Clock />,
        allowedRoles: ['ADMIN', 'SUPERVISOR'],
        children: [
            {
                segment: 'list',
                title: 'HORAS TRABAJADAS',
                icon: <ListAlt />,
                allowedRoles: ['ADMIN', 'SUPERVISOR'],
            },
            {
                segment: 'upload-school',
                title: 'IMPORTAR COLEGIO',
                icon: <UploadCloudIcon />,
                allowedRoles: ['ADMIN'],
            },
            {
                segment: 'upload-academy',
                title: 'IMPORTAR ACADEMIA',
                icon: <UploadCloudIcon />,
                allowedRoles: ['ADMIN'],
            },
        ],
    },
    // vista para solo docentes
    {
        segment: 'teacher-work-hours',
        title: 'MIS HORAS',
        icon: <Clock />,
        allowedRoles: ['TEACHER', 'SUPERVISOR'],
        children: [
            {
                segment: 'list',
                title: 'LISTAR MIS HORAS',
                icon: <ListAlt />,
                allowedRoles: ['TEACHER', 'SUPERVISOR'],
            }
        ]
    },
    {
        segment: 'reports',
        title: 'REPORTES',
        icon: <ListAlt />,
        allowedRoles: ['ADMIN', 'SUPERVISOR'],
        children: [
            {
                segment: 'work-hours',
                title: 'HORAS',
                icon: <ListAlt />,
                allowedRoles: ['ADMIN', 'SUPERVISOR'],
            }
        ],
    },
    {
        segment: 'settings',
        title: 'CONFIGURACIONES',
        icon: <Settings2Icon />,
        allowedRoles: ['ADMIN'],
    }
];
