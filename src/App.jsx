import React, { useMemo, useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./store/store";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import AppRouter from "./routes/AppRouter";
import { navigation } from "./navigation";
import { createDynamicTheme } from "./theme/theme";
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";
import { useColorScheme } from "@mui/material/styles";
import { getSettings } from "./features/settingSlice";

function filterNavigationByRole(navigation, role) {
  return navigation.filter((item) => !item.allowedRoles || item.allowedRoles.includes(role));
}

// Componente que sincroniza el tema guardado con Material-UI
function ThemeSynchronizer({ children }) {
  const { mode, setMode } = useColorScheme();
  
  useEffect(() => {
    // Cargar tema guardado en localStorage y aplicarlo SOLO AL MONTAR
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode && setMode) {
      // Aplicar el modo guardado
      setMode(savedMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  return children;
}

function AppContent() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.setting);
  const { primaryColor, hoverColor, updatePrimaryColor } = useThemeContext();

  const role = user?.user?.role;

  const filteredNavigation = filterNavigationByRole(navigation, role);

  // Cargar settings al inicio de la aplicación (solo si el usuario está autenticado)
  useEffect(() => {
    if (user?.user) {
      dispatch(getSettings());
    }
  }, [dispatch, user]);

  // Sincronizar color del backend si es diferente y más actualizado
  useEffect(() => {
    const savedColor = localStorage.getItem('primaryColor');
    const defaultColor = '#c9a227';
    
    // Si el backend tiene un color Y (localStorage está vacío O es el default), usar el del backend
    if (settings?.themeColor) {
      if (!savedColor || (savedColor === defaultColor && settings.themeColor !== defaultColor)) {
        updatePrimaryColor(settings.themeColor);
      }
    }
  }, [settings?.themeColor, updatePrimaryColor]);

  // Crear tema dinámico basado en las preferencias del usuario
  const dynamicTheme = useMemo(
    () => createDynamicTheme(primaryColor, hoverColor),
    [primaryColor, hoverColor]
  );

  return (
      <ReactRouterAppProvider 
        navigation={filteredNavigation} 
        theme={dynamicTheme}
      >
        <ThemeSynchronizer>
          <AppRouter />
        </ThemeSynchronizer>
      </ReactRouterAppProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}