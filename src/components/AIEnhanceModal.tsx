import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  TextField,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import MemoryIcon from '@mui/icons-material/Memory';
import webllmService from '../services/webllmService';

const ENHANCEMENT_TYPES = {
  summary: {
    title: 'Enhance Summary',
    description: 'Make your professional summary more concise and impactful',
    action: (service, text) => service.enhanceSummary(text),
  },
  experience: {
    title: 'Enhance Experience',
    description: 'Improve your work experience with action verbs and quantified achievements',
    action: (service, text) => service.enhanceExperience(text),
  },
  skills: {
    title: 'Optimize Skills',
    description: 'Organize and prioritize your skills for maximum impact',
    action: (service, text) => service.optimizeSkills(text),
  },
  generateSummary: {
    title: 'Generate Summary',
    description: 'Create a professional summary from your skills and experience',
    action: (service, text, context) => service.generateSummary(context.skills, context.experience),
  },
};

function AIEnhanceModal({ open, onClose, type, originalText, onAccept, context = {} }) {
  const [loadingModel, setLoadingModel] = useState(false);
  const [loadProgress, setLoadProgress] = useState({ progress: 0, status: '' });
  const [modelReady, setModelReady] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [enhancedText, setEnhancedText] = useState('');
  const [error, setError] = useState(null);
  const [webGPUSupported, setWebGPUSupported] = useState(null);

  const enhancementConfig = ENHANCEMENT_TYPES[type] || ENHANCEMENT_TYPES.summary;

  // Check WebGPU support on mount
  useEffect(() => {
    const checkSupport = async () => {
      const result = await webllmService.constructor.checkWebGPUSupport();
      setWebGPUSupported(result.supported);
      if (!result.supported) {
        setError(`Browser not supported: ${result.reason}. Please use Chrome 113+ or Edge 113+.`);
      }
    };
    checkSupport();
  }, []);

  // Check if model is already loaded
  useEffect(() => {
    if (open) {
      const status = webllmService.getStatus();
      setModelReady(status.isReady);
      setEnhancedText('');
      setError(null);
    }
  }, [open]);

  const handleLoadModel = useCallback(async () => {
    setLoadingModel(true);
    setError(null);

    try {
      await webllmService.initialize((progress) => {
        setLoadProgress(progress);
      });
      setModelReady(true);
    } catch (err) {
      setError(err.message || 'Failed to load AI model');
    } finally {
      setLoadingModel(false);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!modelReady) return;

    setGenerating(true);
    setError(null);

    try {
      const result = await enhancementConfig.action(webllmService, originalText, context);
      setEnhancedText(result);
    } catch (err) {
      setError(err.message || 'Failed to generate enhancement');
    } finally {
      setGenerating(false);
    }
  }, [modelReady, originalText, context, enhancementConfig]);

  // Auto-generate when model is ready and modal opens
  useEffect(() => {
    if (open && modelReady && !enhancedText && originalText) {
      handleGenerate();
    }
  }, [open, modelReady, enhancedText, originalText, handleGenerate]);

  const handleAccept = () => {
    onAccept(enhancedText);
    onClose();
  };

  const handleRegenerate = () => {
    setEnhancedText('');
    handleGenerate();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.98) 0%, rgba(30, 30, 60, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {enhancementConfig.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Powered by on-device AI
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* WebGPU Not Supported */}
        {webGPUSupported === false && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Your browser doesn't support WebGPU, which is required for on-device AI.
              Please use <strong>Chrome 113+</strong> or <strong>Edge 113+</strong>.
            </Typography>
          </Alert>
        )}

        {/* Model Loading Section */}
        {!modelReady && webGPUSupported !== false && (
          <Box sx={{ mb: 3 }}>
            {!loadingModel ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <MemoryIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Load AI Model
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    The AI runs entirely in your browser. First-time load downloads ~1-2GB.
                    <br />
                    Cached for future use.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleLoadModel}
                    startIcon={<AutoAwesomeIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)',
                      },
                    }}
                  >
                    Load AI Model
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Box sx={{ p: 3, borderRadius: 2, background: 'rgba(139, 92, 246, 0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CircularProgress size={24} sx={{ color: 'primary.main' }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Loading AI Model...
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={loadProgress.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      mb: 1,
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {loadProgress.status || 'Initializing...'} ({loadProgress.progress}%)
                  </Typography>
                </Box>
              </motion.div>
            )}
          </Box>
        )}

        {/* Model Ready - Show Enhancement */}
        {modelReady && (
          <AnimatePresence mode="wait">
            {generating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress
                    size={48}
                    sx={{
                      color: 'primary.main',
                      mb: 2,
                    }}
                  />
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Enhancing your content...
                  </Typography>
                </Box>
              </motion.div>
            ) : enhancedText ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Original:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      maxHeight: 150,
                      overflow: 'auto',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                      {originalText}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'success.light' }}>
                      Enhanced:
                    </Typography>
                    <Chip
                      label="AI Generated"
                      size="small"
                      icon={<AutoAwesomeIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: 'primary.light',
                        '& .MuiChip-icon': { color: 'primary.light' },
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={enhancedText}
                    onChange={(e) => setEnhancedText(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(16, 185, 129, 0.05)',
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                    You can edit the text before accepting
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                    {enhancementConfig.description}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleGenerate}
                    startIcon={<AutoAwesomeIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                    }}
                  >
                    Generate Enhancement
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        {enhancedText && (
          <>
            <Button
              onClick={handleRegenerate}
              startIcon={<RefreshIcon />}
              disabled={generating}
              sx={{ color: 'primary.light' }}
            >
              Regenerate
            </Button>
            <Button
              variant="contained"
              onClick={handleAccept}
              startIcon={<CheckIcon />}
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #0891B2 100%)',
                },
              }}
            >
              Accept & Apply
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AIEnhanceModal;
