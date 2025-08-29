import UsersPage from "../pages/UserPage";
import UserProfilePage from "../pages/UserProfilePage";
import { TeacherRoutes } from "../pages/TeacherPage";
import { WorkHoursImportAcademyPage, WorkHoursImportSchoolPage, WorkHoursPage } from "../pages/WorkHourPage";
import HomePage from "../pages/HomePage";
import TeacherWorkHourPage from "../pages/TeacherWorkHourPage";
import ReportPage from "../pages/ReportPage";

export const routesConfig = [
    {
        path: "/",
        element: <HomePage />,
        roles: ["ADMIN", "TEACHER", "SECRETARY", "SUPERVISOR"],
    },
    {
        path: "/profile",
        element: <UserProfilePage />,
        roles: ["ADMIN", "TEACHER", "SECRETARY", "SUPERVISOR"],
    },
    {
        path: "/users/list",
        element: <UsersPage />,
        roles: ["ADMIN", "SECRETARY", "SUPERVISOR"], // SOLO ADMIN
    },
    {
        path: "/teachers/list",
        element: <TeacherRoutes.TeachersPage />,
        roles: ["ADMIN", "SECRETARY", "SUPERVISOR"],
    },
    {
        path: "/teachers/upload",
        element: <TeacherRoutes.TeacherUploadPage />,
        roles: ["ADMIN", "SECRETARY", "SUPERVISOR"],
    },
    {
        path: "/work-hours/list",
        element: <WorkHoursPage />,
        roles: ["ADMIN", "SECRETARY", "SUPERVISOR"],
    },
    {
        path: "/work-hours/upload-academy",
        element: <WorkHoursImportAcademyPage />,
        roles: ["ADMIN", "SECRETARY", "SUPERVISOR"],
    },
    {
        path: "/work-hours/upload-school",
        element: <WorkHoursImportSchoolPage />,
        roles: ["ADMIN", "SECRETARY", "SUPERVISOR"],
    },
    {
        path: "/teacher-work-hours/list",
        element: <TeacherWorkHourPage />,
        roles: ["TEACHER", "SUPERVISOR"],
    },
    {
        path: "/reports/work-hours",
        element: <ReportPage />,
        roles: ["ADMIN", "TEACHER", "SUPERVISOR"],
    }
];
