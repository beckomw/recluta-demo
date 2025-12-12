import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import StorageIcon from '@mui/icons-material/Storage';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { isFirstLaunch, markFirstLaunchShown } from '../services/dataService';

function FirstLaunchWarning() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if this is first launch after a short delay
    const timer = setTimeout(() => {
      if (isFirstLaunch()) {
        setOpen(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    markFirstLaunchShown();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.98) 0%, rgba(30, 30, 60, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StorageIcon sx={{ color: 'white', fontSize: 26 }} />
            </Box>
          </motion.div>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Welcome to Recluta!
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Important info about your data
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            '& .MuiAlert-icon': {
              color: '#F59E0B',
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Your data is stored locally in this browser only
          </Typography>
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            This means:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0, color: 'text.secondary' }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Clearing your browser history/cache will <strong style={{ color: '#EF4444' }}>delete all your data</strong>
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Your data won't sync across devices or browsers
            </Typography>
            <Typography component="li" variant="body2">
              Private/incognito mode won't save your data
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <CloudDownloadIcon sx={{ color: 'success.light', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.light' }}>
              Pro Tip: Export your data regularly
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Go to <strong>Dashboard → Data Management</strong> to export a backup file you can import anytime.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)',
            },
          }}
        >
          Got it, let's go!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FirstLaunchWarning;
