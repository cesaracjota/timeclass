// theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme', // lo dejamos EXACTAMENTE como lo tenías
  },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: {
          main: '#6A5EEF',
          contrastText: '#fff',
        },
        info: {
          main: '#6A5EEF',
          contrastText: '#fff',
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: {
          main: '#6A5EEF',
          contrastText: '#fff',
        },
        info: {
          main: '#6A5EEF',
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
            backgroundColor: '#6A5EEF',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#5A4EDE',
            },
            '&:active': {
              backgroundColor: '#4A3ECE',
            },
            '&:focus': {
              backgroundColor: '#4A3ECE',
            },
            '&:disabled': {
              backgroundColor: '#B3B3B3',
              color: '#ffffff',
            },
          },
          '&.MuiButton-outlined': {
            borderColor: '#6A5EEF',
            color: '#6A5EEF',
            '&:hover': {
              borderColor: '#5A4EDE',
              color: '#5A4EDE',
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