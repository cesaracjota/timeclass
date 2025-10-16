# Sistema de Temas Dinámico

## Descripción
Se ha implementado un sistema de temas completamente dinámico que permite:
- ✅ Cambiar entre modo claro y oscuro
- ✅ Personalizar el color principal de la aplicación
- ✅ Persistencia automática en localStorage
- ✅ Sincronización con el backend (si existe)
- ✅ Vista previa en tiempo real de los cambios

## Archivos Modificados/Creados

### 1. **ThemeContext.jsx** (NUEVO)
Contexto de React que maneja el estado del tema:
- `themeMode`: 'light' o 'dark'
- `primaryColor`: Color principal (hex)
- `toggleThemeMode()`: Cambia entre modo claro y oscuro
- `updatePrimaryColor(color)`: Actualiza el color principal
- Persistencia automática en localStorage

### 2. **theme.jsx** (MODIFICADO)
- Nueva función `createDynamicTheme(primaryColor, hoverColor)` para crear temas dinámicos
- Los colores ahora son parametrizables
- Mantiene compatibilidad con el tema por defecto

### 3. **App.jsx** (MODIFICADO)
- Integra el `ThemeProvider` en la raíz de la aplicación
- Usa `createDynamicTheme` con los colores del contexto
- El tema se regenera automáticamente cuando cambian los colores

### 4. **Setting.jsx** (MODIFICADO)
- Nueva sección de "Configuración de Tema"
- Switch para cambiar entre modo claro/oscuro con iconos
- Color picker para seleccionar el color principal
- Vista previa en tiempo real al cambiar el color
- Sincronización con backend (si existe)

## Cómo Usar

### Para el Usuario Final
1. Ve a la página de Settings
2. En la sección "Configuración de Tema":
   - Usa el switch para cambiar entre modo claro y oscuro
   - Selecciona un color usando el selector de color
   - Los cambios se aplican inmediatamente
3. Click en "Guardar" para persistir en el backend (opcional)

### Para Desarrolladores

#### Acceder al contexto del tema en cualquier componente:
```javascript
import { useThemeContext } from '../context/ThemeContext';

function MyComponent() {
  const { themeMode, primaryColor, toggleThemeMode, updatePrimaryColor } = useThemeContext();
  
  return (
    <div>
      <p>Modo actual: {themeMode}</p>
      <p>Color principal: {primaryColor}</p>
      <button onClick={toggleThemeMode}>Cambiar modo</button>
      <button onClick={() => updatePrimaryColor('#ff0000')}>Usar rojo</button>
    </div>
  );
}
```

## Almacenamiento

### localStorage
Los siguientes valores se guardan automáticamente:
- `themeMode`: El modo de tema actual ('light' o 'dark')
- `primaryColor`: El color principal en formato hex (#rrggbb)

### Backend (opcional)
Si existe un backend, el color también se guarda en el campo `themeColor` del modelo de configuración.

## Características Técnicas

- **Persistencia**: Los cambios se guardan automáticamente en localStorage
- **Performance**: Usa `useMemo` para evitar recreaciones innecesarias del tema
- **Sincronización**: El color se sincroniza entre localStorage y backend
- **Vista previa**: Los cambios de color se aplican inmediatamente sin necesidad de guardar
- **Color hover**: Se calcula automáticamente un color más oscuro para estados hover

## Notas
- Los cambios son persistentes entre sesiones (localStorage)
- El tema se aplica globalmente a toda la aplicación
- Compatible con Material-UI y Toolpad
- El selector de color usa el color picker nativo del navegador
