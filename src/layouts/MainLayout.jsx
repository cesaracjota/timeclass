import React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box, Typography } from '@mui/material';
import ToolbarActions from './ToolBarActions';

// Custom App Title
function CustomAppTitle() {
  return (
    <h1 style={{ fontSize: "1.4rem", fontWeight: "bold", margin: "0 auto", alignSelf: "center", color: "#a47e1b" }} className="text-primary text-center">TIMECLASS</h1>
  );
}

// Navegación y layout principal
const MainLayout = ({ children }) => {

  return (
    <DashboardLayout
      slots={{
        appTitle: CustomAppTitle,
        toolbarActions: ToolbarActions,
      }}
    >
      <Box
        sx={{
          p: [2, 4]
        }}
      >
        {children}
      </Box>
    </DashboardLayout>
  );
};

export default MainLayout;
