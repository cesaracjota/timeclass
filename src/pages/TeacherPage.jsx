import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Teachers from '../components/teachers/Teachers';
import UploadTeachers from '../components/teachers/UploadTeachers';
// eslint-disable-next-line react-refresh/only-export-components
const TeachersPage = () => {
    return (
        <MainLayout>
            <Teachers />
        </MainLayout>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
const TeacherUploadPage = () => {
    return (
        <MainLayout>
            <UploadTeachers />
        </MainLayout>
    )
}

export const TeacherRoutes = {
    TeachersPage,
    TeacherUploadPage
};