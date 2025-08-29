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
          main: '#c9a227',
          contrastText: '#fff',
        },
        info: {
          main: '#c9a227',
          contrastText: '#fff',
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: {
          main: '#c9a227',
          contrastText: '#fff',
        },
        info: {
          main: '#c9a227',
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
            backgroundColor: '#c9a227',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#a47e1b',
            },
            '&:active': {
              backgroundColor: '#a47e1b',
            },
            '&:focus': {
              backgroundColor: '#a47e1b',
            },
            '&:disabled': {
              backgroundColor: '#B3B3B3',
              color: '#ffffff',
            },
          },
          '&.MuiButton-outlined': {
            borderColor: '#c9a227',
            color: '#c9a227',
            '&:hover': {
              borderColor: '#a47e1b',
              color: '#a47e1b',
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