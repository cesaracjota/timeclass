import {
    Paper,
    Typography,
    Alert,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
  } from "@mui/material";
  import { AlertCircleIcon, AlertOctagonIcon, AlertTriangle } from "lucide-react";
  
  /**
   * Componente reutilizable para mostrar errores o registros omitidos.
   * @param {string} title - Título del bloque.
   * @param {string} description - Descripción del aviso general.
   * @param {Array<{ reason: string, row?: number }>} items - Lista de elementos omitidos.
   */
  export const SkippedItemsAlert = ({ title = "REGISTROS OMITIDOS", description, items = [] }) => {
    if (!items.length) return null;
  
    return (
      <Stack spacing={2} mt={2}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}
          >
            <AlertOctagonIcon color="#ed6c02" size={30} />
            {title}
          </Typography>
  
          {description && (
            <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
              {description}
            </Alert>
          )}
  
          <Divider sx={{ mb: 2 }} />
  
          <List dense disablePadding>
            {items.map((item, index) => (
              <ListItem key={index} sx={{ pl: 0, borderBottom: "1px solid #ed6c02" }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <AlertCircleIcon size={20} color="#ed6c02" />
                </ListItemIcon>
                <ListItemText
                  primary={item.reason}
                  secondary={
                    item.row !== undefined ? `Fila: ${item.row}` : null
                  }
                  primaryTypographyProps={{ fontSize: 14 }}
                  secondaryTypographyProps={{ fontSize: 12, color: "text.secondary" }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Stack>
    );
  };
  