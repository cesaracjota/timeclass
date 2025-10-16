import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Solo manejar el color, el modo lo maneja Material-UI directamente
  const [primaryColor, setPrimaryColor] = useState(() => {
    const savedColor = localStorage.getItem('primaryColor');
    return savedColor || '#c9a227';
  });

  // Guardar en localStorage cuando cambie el color
  useEffect(() => {
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  const updatePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  // Función para generar color hover (más oscuro)
  const getHoverColor = (color) => {
    // Convertir hex a RGB y oscurecer
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const factor = 0.8;
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const value = useMemo(
    () => ({
      primaryColor,
      hoverColor: getHoverColor(primaryColor),
      updatePrimaryColor,
    }),
    [primaryColor]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
