import React from "react";
import MainLayout from "../layouts/MainLayout";
import { AccessDenied } from "../components/ui/403";

export const AccessDeniedPage = () => {

    return (
        <MainLayout>
            <AccessDenied />
        </MainLayout>
    )
};
