import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Close as CloseIcon, CheckCircle } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateStatusWorkHour } from "../../../features/workHourSlice";

const ConfirmChangeStateDialog = ({ idWorkHour }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      // Simula llamada a API para cambiar estado
      await new Promise((res) => setTimeout(res, 1500));
      dispatch(updateStatusWorkHour({ id: idWorkHour, estado: 'ACCEPTED' }));
      setOpen(false);
    } catch (error) {
      console.error("Error cambiando estado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Estoy Conforme con las horas">
        <IconButton color="success" onClick={handleOpen}><CheckCircle /></IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle color="primary" />
            <Typography variant="h6">Confirmar Cambio de Estado</Typography>
          </Box>
          <IconButton edge="end" onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography>
            Estás seguro de que estas conforme con las horas de trabajo?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmChangeStateDialog;
