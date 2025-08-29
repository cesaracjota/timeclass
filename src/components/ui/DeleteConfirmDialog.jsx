import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Alert,
  useTheme,
  Divider,
} from '@mui/material';
import { Trash2, X, AlertCircle, AlertCircleIcon } from 'lucide-react';
import { red } from '@mui/material/colors';

export const DeleteConfirmDialog = ({ title, description, onConfirm, renderTrigger }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const handleConfirm = async () => {
    try {
      await onConfirm();
      setOpen(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al intentar eliminar.');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <>
      {renderTrigger(() => setOpen(true))}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2.5}
          py={2}
        >
          <Box display="flex" alignItems="center">
            <DialogTitle sx={{ p: 0, fontSize: '1.2rem', fontWeight: 600 }}>
              {title}
            </DialogTitle>
          </Box>
          <IconButton size="large" color="inherit" onClick={handleClose}>
            <X size={25} />
          </IconButton>
        </Box>

        <Divider />

        <DialogContent
          dividers
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
            pt: 3,
            pb: 1,
          }}
        >
          <Box
            component={AlertCircleIcon}
            color={red[500]}
            size={150}
            sx={{
              mb: 1,
            }}
          />

          <Typography variant='h5' color="text.primary" fontWeight={500}>
            {description}
          </Typography>

          <Alert severity="info" sx={{ width: '100%' }}>
            Esta acción no se puede deshacer.
          </Alert>

          {error && (
            <Alert
              severity="error"
              sx={{ width: '100%' }}
              icon={<AlertCircle size={18} />}
            >
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            size="large"
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderColor: theme.palette.divider,
            }}
          >
            CANCELAR
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            size="large"
            startIcon={<Trash2 size={18} />}
            fullWidth
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            ELIMINAR
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
