import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Memory as MemoryIcon,
} from '@mui/icons-material';
import webllmService from '../services/webllmService';

/**
 * WebLLM Performance Monitoring Dashboard
 *
 * Displays real-time performance metrics, token usage, and memory snapshots
 * for the WebLLM service.
 *
 * Usage:
 * - Click "View Metrics" to see detailed performance data
 * - Click "Download" to export metrics as JSON
 * - Click "Refresh" to update metrics in real-time
 */
const WebLLMMonitor = ({ open, onClose }) => {
  const [metrics, setMetrics] = useState(null);
  const [status, setStatus] = useState(null);

  const refreshMetrics = () => {
    const metricsData = webllmService.getMetrics();
    const statusData = webllmService.getStatus();
    setMetrics(metricsData);
    setStatus(statusData);
  };

  useEffect(() => {
    if (open) {
      refreshMetrics();
    }
  }, [open]);

  const handleDownload = () => {
    webllmService.downloadMetrics();
  };

  const handlePrintToConsole = () => {
    webllmService.printMetrics();
  };

  if (!metrics || !status) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <AssessmentIcon />
            <Typography variant="h6">WebLLM Performance Monitor</Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Chip
              label={status.isReady ? 'Ready' : status.isLoading ? 'Loading' : 'Not Loaded'}
              color={status.isReady ? 'success' : status.isLoading ? 'warning' : 'default'}
              size="small"
            />
            {status.debug && <Chip label="Debug Mode" color="info" size="small" />}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Status Overview */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Status Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Model
                </Typography>
                <Typography variant="body2">
                  {status.model || 'Not loaded'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body2">
                  {status.isReady ? '✓ Ready' : status.isLoading ? '⏳ Loading' : '○ Idle'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2">{status.progress}%</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Debug Mode
                </Typography>
                <Typography variant="body2">{status.debug ? 'Enabled' : 'Disabled'}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Initialization Metrics */}
        {metrics.initialization.duration && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Initialization
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body2">
                    {metrics.initialization.durationSeconds}s
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary">
                    Model
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    {metrics.initialization.modelLoaded}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary">
                    Source
                  </Typography>
                  <Typography variant="body2">
                    {metrics.initialization.fromCache ? '📦 Cache' : '⬇️ Download'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Generation Metrics */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Generations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h5">{metrics.generations.total}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Total Tokens
                </Typography>
                <Typography variant="h5">{metrics.generations.totalTokens}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Avg Time
                </Typography>
                <Typography variant="h5">{metrics.generations.avgGenerationTimeMs}ms</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Avg Throughput
                </Typography>
                <Typography variant="h5">
                  {metrics.generations.avgThroughputTokensPerSec}
                  <Typography variant="caption" component="span">
                    {' '}
                    tok/s
                  </Typography>
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              By Type
            </Typography>
            <Grid container spacing={1}>
              {Object.entries(metrics.generations.byType).map(([type, count]) => (
                <Grid item xs={6} sm={4} key={type}>
                  <Chip label={`${type}: ${count}`} size="small" variant="outlined" />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Cache Metrics */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cache Performance
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  Hits
                </Typography>
                <Typography variant="h5">{metrics.cache.hits}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  Misses
                </Typography>
                <Typography variant="h5">{metrics.cache.misses}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary">
                  Hit Rate
                </Typography>
                <Typography variant="h5">{metrics.cache.hitRate}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Generations */}
        {metrics.generations.recentGenerations.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Generations
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Duration</TableCell>
                      <TableCell align="right">Tokens</TableCell>
                      <TableCell align="right">Throughput</TableCell>
                      <TableCell align="right">Temperature</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.generations.recentGenerations.map((gen, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{gen.type}</TableCell>
                        <TableCell align="right">{gen.durationSeconds}s</TableCell>
                        <TableCell align="right">{gen.tokensUsed}</TableCell>
                        <TableCell align="right">{gen.throughput.toFixed(2)} tok/s</TableCell>
                        <TableCell align="right">{gen.temperature}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Memory Snapshots */}
        {metrics.memory.snapshots > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <MemoryIcon fontSize="small" />
                <Typography variant="h6">Memory Usage</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                {metrics.memory.snapshots} snapshots captured
              </Typography>
              {metrics.memory.recent.length > 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Label</TableCell>
                        <TableCell align="right">Used Heap</TableCell>
                        <TableCell align="right">Total Heap</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metrics.memory.recent.map((snapshot, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{snapshot.label}</TableCell>
                          <TableCell align="right">
                            {(snapshot.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB
                          </TableCell>
                          <TableCell align="right">
                            {(snapshot.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Errors */}
        {metrics.errors.total > 0 && (
          <Card sx={{ mb: 2, bgcolor: 'error.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Errors ({metrics.errors.total})
              </Typography>
              {metrics.errors.recent.map((error, idx) => (
                <Box key={idx} mb={1}>
                  <Typography variant="caption" color="error">
                    {error.timestamp}
                  </Typography>
                  <Typography variant="body2" color="error">
                    {error.message}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handlePrintToConsole} startIcon={<AssessmentIcon />}>
          Print to Console
        </Button>
        <Button onClick={handleDownload} startIcon={<DownloadIcon />}>
          Download JSON
        </Button>
        <Button onClick={refreshMetrics} startIcon={<RefreshIcon />}>
          Refresh
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WebLLMMonitor;
