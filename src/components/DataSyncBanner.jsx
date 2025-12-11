import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  TextField,
  Alert,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { downloadDataAsFile, readJsonFile, importData, validateImportData } from '../services/dataService';

function DataSyncBanner({ onDataChange }) {
  const [showCloudTeaser, setShowCloudTeaser] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleExport = () => {
    try {
      downloadDataAsFile();
      setImportStatus({ type: 'success', message: 'Data exported! Check your downloads.' });
      setTimeout(() => setImportStatus(null), 3000);
    } catch (error) {
      setImportStatus({ type: 'error', message: 'Export failed. Please try again.' });
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await readJsonFile(file);
      const validation = validateImportData(data);

      if (!validation.valid) {
        setImportStatus({ type: 'error', message: validation.errors.join(', ') });
        return;
      }

      const result = importData(data, false);
      setImportStatus({
        type: 'success',
        message: `Imported ${result.imported.length} data types successfully!`
      });
      if (onDataChange) onDataChange();
      setTimeout(() => setImportStatus(null), 3000);
    } catch (error) {
      setImportStatus({ type: 'error', message: `Import failed: ${error.message}` });
    }
    e.target.value = '';
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // Store in localStorage for now (would connect to a real service)
      const subscribers = JSON.parse(localStorage.getItem('app_newsletter_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('app_newsletter_subscribers', JSON.stringify(subscribers));
      }
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Main Export/Import Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PhoneIphoneIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Your data lives in this browser
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Export to backup or transfer to another device
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Button
              size="small"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                borderColor: 'rgba(139, 92, 246, 0.5)',
                color: 'primary.light',
                '&:hover': {
                  borderColor: 'primary.main',
                  background: 'rgba(139, 92, 246, 0.1)',
                },
              }}
            >
              Import
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              onClick={handleExport}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)',
                },
              }}
            >
              Export
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Status Alert */}
      <AnimatePresence>
        {importStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert
              severity={importStatus.type}
              sx={{ mt: 1 }}
              onClose={() => setImportStatus(null)}
            >
              {importStatus.message}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cloud Sync Teaser */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3,
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => setShowCloudTeaser(!showCloudTeaser)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CloudSyncIcon sx={{ color: '#10B981', fontSize: 24 }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#10B981' }}>
                    Cloud Sync Coming Soon
                  </Typography>
                  <Chip
                    label="Roadmap"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10B981',
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Sync across devices automatically
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: '#10B981' }}>
              {showCloudTeaser ? 'Hide' : 'Learn more'}
            </Typography>
          </Box>

          <Collapse in={showCloudTeaser}>
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                We're building automatic cloud sync so your data follows you everywhere.
                Get notified when it launches:
              </Typography>

              {subscribed ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(16, 185, 129, 0.15)',
                  }}
                >
                  <CheckCircleIcon sx={{ color: '#10B981' }} />
                  <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 500 }}>
                    You're on the list! We'll notify you when cloud sync is ready.
                  </Typography>
                </Box>
              ) : (
                <Box
                  component="form"
                  onSubmit={handleSubscribe}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="your@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(16, 185, 129, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(16, 185, 129, 0.5)',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    startIcon={<NotificationsActiveIcon />}
                    sx={{
                      background: '#10B981',
                      '&:hover': { background: '#059669' },
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Notify Me
                  </Button>
                </Box>
              )}

              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1.5 }}>
                Your email is only used to notify you about product updates.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </motion.div>
    </Box>
  );
}

export default DataSyncBanner;
