import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import AppRouter from "./routes/AppRouter";
import { navigation } from "./navigation";
import { theme } from "./theme/theme";


function filterNavigationByRole(navigation, role) {
  return navigation.filter((item) => !item.allowedRoles || item.allowedRoles.includes(role));
}

function AppContent() {
  const { user } = useSelector((state) => state.auth);

  const role = user?.user?.role;

  const filteredNavigation = filterNavigationByRole(navigation, role);

  return (
      <ReactRouterAppProvider navigation={filteredNavigation} theme={theme}>
        <AppRouter />
      </ReactRouterAppProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}