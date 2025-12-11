import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import {
  downloadDataAsFile,
  readJsonFile,
  validateImportData,
  importData,
  getStorageStats,
  clearAllData,
} from '../services/dataService';

function DataManagement({ onDataChange }) {
  const [stats, setStats] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    refreshStats();
  }, []);

  const refreshStats = () => {
    setStats(getStorageStats());
  };

  const handleExport = () => {
    try {
      downloadDataAsFile();
      setImportStatus({
        type: 'success',
        message: 'Data exported successfully! Check your downloads folder.',
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: `Export failed: ${error.message}`,
      });
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await readJsonFile(file);
      const validation = validateImportData(data);

      setImportPreview({
        file: file.name,
        data,
        validation,
        stats: {
          resumes: data.data?.app_resumes?.length || 0,
          jobs: data.data?.app_jobs?.length || 0,
          applications: data.data?.app_applications?.length || 0,
        },
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: `Failed to read file: ${error.message}`,
      });
    }

    // Reset file input
    e.target.value = '';
  };

  const handleImportConfirm = (merge = false) => {
    try {
      const result = importData(importPreview.data, merge);
      setImportStatus({
        type: 'success',
        message: `Data imported successfully! ${result.imported.length} data types updated.${result.warnings.length ? ' ' + result.warnings.join(', ') : ''}`,
      });
      setImportPreview(null);
      refreshStats();
      if (onDataChange) onDataChange();
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: `Import failed: ${error.message}`,
      });
    }
  };

  const handleClearData = () => {
    clearAllData();
    setConfirmClear(false);
    setImportStatus({
      type: 'success',
      message: 'All data cleared successfully.',
    });
    refreshStats();
    if (onDataChange) onDataChange();
  };

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(30, 30, 60, 0.6) 0%, rgba(15, 15, 35, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StorageIcon sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Data Management
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Export, import, and manage your local data
            </Typography>
          </Box>
        </Box>

        {/* Status Alert */}
        {importStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert
              severity={importStatus.type}
              onClose={() => setImportStatus(null)}
              sx={{ mb: 3 }}
            >
              {importStatus.message}
            </Alert>
          </motion.div>
        )}

        {/* Storage Stats */}
        {stats && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1.5 }}>
              Current Storage
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${stats.itemCounts.resumes} Resumes`}
                size="small"
                sx={{ background: 'rgba(139, 92, 246, 0.2)', color: 'primary.light' }}
              />
              <Chip
                label={`${stats.itemCounts.jobs} Jobs`}
                size="small"
                sx={{ background: 'rgba(6, 182, 212, 0.2)', color: 'secondary.light' }}
              />
              <Chip
                label={`${stats.itemCounts.applications} Applications`}
                size="small"
                sx={{ background: 'rgba(16, 185, 129, 0.2)', color: 'success.light' }}
              />
              <Chip
                label={`${stats.totalKB} KB used`}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              />
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              onClick={handleExport}
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #0891B2 100%)',
                },
              }}
            >
              Export Data
            </Button>
          </motion.div>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
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
              Import Data
            </Button>
          </motion.div>
        </Box>

        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Danger Zone */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'error.light', mb: 1.5 }}>
            Danger Zone
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setConfirmClear(true)}
          >
            Clear All Data
          </Button>
        </Box>
      </CardContent>

      {/* Import Preview Dialog */}
      <Dialog
        open={!!importPreview}
        onClose={() => setImportPreview(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(15, 15, 35, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle>Import Data</DialogTitle>
        <DialogContent>
          {importPreview && (
            <>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                File: <strong>{importPreview.file}</strong>
              </Typography>

              {!importPreview.validation.valid ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {importPreview.validation.errors.join(', ')}
                </Alert>
              ) : (
                <>
                  {importPreview.validation.warnings?.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {importPreview.validation.warnings.join(', ')}
                    </Alert>
                  )}

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.03)',
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Data to Import:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`${importPreview.stats.resumes} Resumes`}
                        size="small"
                        icon={<CheckCircleIcon />}
                        sx={{ background: 'rgba(16, 185, 129, 0.2)' }}
                      />
                      <Chip
                        label={`${importPreview.stats.jobs} Jobs`}
                        size="small"
                        icon={<CheckCircleIcon />}
                        sx={{ background: 'rgba(16, 185, 129, 0.2)' }}
                      />
                      <Chip
                        label={`${importPreview.stats.applications} Applications`}
                        size="small"
                        icon={<CheckCircleIcon />}
                        sx={{ background: 'rgba(16, 185, 129, 0.2)' }}
                      />
                    </Box>
                  </Box>

                  <Alert severity="info" icon={<WarningIcon />}>
                    Choose how to handle existing data:
                  </Alert>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button onClick={() => setImportPreview(null)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          {importPreview?.validation.valid && (
            <>
              <Button
                variant="outlined"
                onClick={() => handleImportConfirm(true)}
                sx={{ borderColor: 'rgba(139, 92, 246, 0.5)', color: 'primary.light' }}
              >
                Merge with Existing
              </Button>
              <Button
                variant="contained"
                onClick={() => handleImportConfirm(false)}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                }}
              >
                Replace All
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Clear Data Confirmation Dialog */}
      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        PaperProps={{
          sx: {
            background: 'rgba(15, 15, 35, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'error.light' }}>Clear All Data?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            This will permanently delete all your resumes, jobs, applications, and other data.
            This action cannot be undone.
          </DialogContentText>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Consider exporting your data first as a backup!
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setConfirmClear(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleClearData}
            startIcon={<DeleteForeverIcon />}
          >
            Yes, Clear Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default DataManagement;
