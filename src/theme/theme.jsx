// theme.js
import { createTheme } from '@mui/material/styles';

// Función para crear tema dinámico
export const createDynamicTheme = (primaryColor = '#c9a227', hoverColor = '#a47e1b') => {
  return createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: {
      light: {
        palette: {
          mode: 'light',
          primary: {
            main: primaryColor,
            contrastText: '#fff',
          },
          info: {
            main: primaryColor,
            contrastText: '#fff',
          },
        },
      },
      dark: {
        palette: {
          mode: 'dark',
          primary: {
            main: primaryColor,
            contrastText: '#fff',
          },
          info: {
            main: primaryColor,
            contrastText: '#fff',
          },
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            paddingInline: '20px',
            '&.MuiButton-contained': {
              backgroundColor: primaryColor,
              color: '#ffffff',
              '&:hover': {
                backgroundColor: hoverColor,
              },
              '&:active': {
                backgroundColor: hoverColor,
              },
              '&:focus': {
                backgroundColor: hoverColor,
              },
              '&:disabled': {
                backgroundColor: '#B3B3B3',
                color: '#ffffff',
              },
            },
            '&.MuiButton-outlined': {
              borderColor: primaryColor,
              color: primaryColor,
              '&:hover': {
                borderColor: hoverColor,
                color: hoverColor,
              },
            }
          },
        },
        defaultProps: {
          disableRipple: true,
        },
      },
    },
  });
};

// Tema por defecto para compatibilidad
export const theme = createDynamicTheme();