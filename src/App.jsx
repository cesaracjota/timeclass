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
  return navigation
    .filter((item) => !item.allowedRoles || item.allowedRoles.includes(role))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterNavigationByRole(item.children, role),
        };
      }
      return item;
    });
}

// Componente que sincroniza el tema guardado con Material-UI
function ThemeSynchronizer({ children }) {
  const { setMode } = useColorScheme();

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode && setMode) {
      setMode(savedMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}

import { MaintenancePage } from "./pages/MaintenancePage";

function AppContent() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.setting);
  const { primaryColor, hoverColor, updatePrimaryColor } = useThemeContext();

  const role = user?.user?.role;

  const filteredNavigation = filterNavigationByRole(navigation, role);

  useEffect(() => {
    if (user?.user) {
      dispatch(getSettings());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const savedColor = localStorage.getItem('primaryColor');
    const defaultColor = '#c9a227';

    if (settings?.themeColor) {
      if (!savedColor || (savedColor === defaultColor && settings.themeColor !== defaultColor)) {
        updatePrimaryColor(settings.themeColor);
      }
    }
  }, [settings?.themeColor, updatePrimaryColor]);

  const dynamicTheme = useMemo(
    () => createDynamicTheme(primaryColor, hoverColor),
    [primaryColor, hoverColor]
  );

  if (settings?.inMaintenance) {
    return (
      <ReactRouterAppProvider navigation={[]} theme={dynamicTheme}>
        <ThemeProvider>
          <MaintenancePage />
        </ThemeProvider>
      </ReactRouterAppProvider>
    )
  }

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