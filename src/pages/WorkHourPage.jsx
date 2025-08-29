import React from 'react';
import MainLayout from '../layouts/MainLayout';
import WorkHours from '../components/workHours/WorkHours';
import WorkHoursImport from '../components/workHours/WorkHoursSchoolImport';
import WorkHoursAcademyImport from '../components/workHours/WorkHoursAcademyImport';
import WorkHoursSchoolImport from '../components/workHours/WorkHoursSchoolImport';

export const WorkHoursPage = () => {
    return (
        <MainLayout>
            <WorkHours />
        </MainLayout>
    )
}

export const WorkHoursImportSchoolPage = () => {
    return (
        <MainLayout>
            <WorkHoursSchoolImport />
        </MainLayout>
    )
}
export const WorkHoursImportAcademyPage = () => {
    return (
        <MainLayout>
            <WorkHoursAcademyImport />
        </MainLayout>
    )
}