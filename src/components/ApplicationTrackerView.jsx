import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  LinearProgress,
  Collapse,
  Tabs,
  Tab,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import CodeIcon from '@mui/icons-material/Code';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TimelineIcon from '@mui/icons-material/Timeline';
import NotesIcon from '@mui/icons-material/Notes';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import LinkIcon from '@mui/icons-material/Link';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// Application Status Definitions
const APPLICATION_STATUSES = {
  applied: {
    label: 'Applied',
    color: '#8B5CF6',
    icon: SendIcon,
    description: 'Application submitted',
    isActive: true,
  },
  employer_viewed: {
    label: 'Viewed',
    color: '#06B6D4',
    icon: WorkIcon,
    description: 'Employer viewed your application',
    isActive: true,
  },
  phone_screen: {
    label: 'Phone Screen',
    color: '#3B82F6',
    icon: PhoneIcon,
    description: 'Phone/initial screening',
    isActive: true,
  },
  interview: {
    label: 'Interview',
    color: '#10B981',
    icon: VideocamIcon,
    description: 'Interview stage',
    isActive: true,
  },
  technical_assessment: {
    label: 'Technical',
    color: '#F59E0B',
    icon: CodeIcon,
    description: 'Take-home or technical test',
    isActive: true,
  },
  offer_received: {
    label: 'Offer',
    color: '#EC4899',
    icon: LocalOfferIcon,
    description: 'Received an offer',
    isActive: true,
  },
  accepted: {
    label: 'Accepted',
    color: '#10B981',
    icon: CheckCircleIcon,
    description: 'Accepted the offer',
    isActive: false,
  },
  rejected: {
    label: 'Rejected',
    color: '#EF4444',
    icon: CancelIcon,
    description: 'Rejected by employer',
    isActive: false,
  },
  withdrawn: {
    label: 'Withdrawn',
    color: '#6B7280',
    icon: RemoveCircleIcon,
    description: 'You withdrew your application',
    isActive: false,
  },
  ghosted: {
    label: 'No Response',
    color: '#9CA3AF',
    icon: HourglassEmptyIcon,
    description: 'No response after waiting',
    isActive: false,
  },
};

// Status progression order
const STATUS_ORDER = [
  'applied',
  'employer_viewed',
  'phone_screen',
  'interview',
  'technical_assessment',
  'offer_received',
  'accepted',
];

const CLOSED_STATUSES = ['accepted', 'rejected', 'withdrawn', 'ghosted'];

function ApplicationTrackerView({ onNavigate }) {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showNewAppDialog, setShowNewAppDialog] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [expandedApp, setExpandedApp] = useState(null);
  const [newAppData, setNewAppData] = useState({ jobId: '', resumeId: '', notes: '' });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedApps = localStorage.getItem('app_applications');
    const storedJobs = localStorage.getItem('app_jobs');
    const storedResumes = localStorage.getItem('app_resumes');

    if (storedApps) setApplications(JSON.parse(storedApps));
    if (storedJobs) setJobs(JSON.parse(storedJobs));
    if (storedResumes) setResumes(JSON.parse(storedResumes));
  };

  const saveApplications = (updatedApps) => {
    localStorage.setItem('app_applications', JSON.stringify(updatedApps));
    setApplications(updatedApps);
  };

  const getJobById = (jobId) => jobs.find((j) => j.id === jobId);
  const getResumeById = (resumeId) => resumes.find((r) => r.id === resumeId);

  // Create a new application
  const createApplication = (jobId, resumeId, notes = '') => {
    const newApp = {
      id: Date.now().toString(),
      jobId,
      resumeId,
      status: 'applied',
      appliedDate: Date.now(),
      lastUpdated: Date.now(),
      timeline: [
        {
          status: 'applied',
          date: Date.now(),
          notes: notes || 'Application submitted',
        },
      ],
      nextAction: '',
      nextActionDate: null,
      isArchived: false,
    };

    const updatedApps = [...applications, newApp];
    saveApplications(updatedApps);
    return newApp;
  };

  // Update application status
  const updateApplicationStatus = (appId, newStatus, notes = '') => {
    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        const timelineEntry = {
          status: newStatus,
          date: Date.now(),
          notes,
        };
        return {
          ...app,
          status: newStatus,
          lastUpdated: Date.now(),
          timeline: [...app.timeline, timelineEntry],
          isArchived: CLOSED_STATUSES.includes(newStatus) ? app.isArchived : false,
        };
      }
      return app;
    });
    saveApplications(updatedApps);
  };

  // Archive/unarchive application
  const toggleArchive = (appId) => {
    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        return { ...app, isArchived: !app.isArchived };
      }
      return app;
    });
    saveApplications(updatedApps);
  };

  // Delete application
  const deleteApplication = (appId) => {
    const updatedApps = applications.filter((app) => app.id !== appId);
    saveApplications(updatedApps);
    setSelectedApp(null);
  };

  // Update next action
  const updateNextAction = (appId, action, actionDate) => {
    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        return {
          ...app,
          nextAction: action,
          nextActionDate: actionDate,
          lastUpdated: Date.now(),
        };
      }
      return app;
    });
    saveApplications(updatedApps);
  };

  // Get filtered applications
  const getFilteredApplications = () => {
    let filtered = [...applications];

    // Filter by archived status
    if (!showArchived) {
      filtered = filtered.filter((app) => !app.isArchived);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'active') {
        filtered = filtered.filter((app) => APPLICATION_STATUSES[app.status]?.isActive);
      } else if (filterStatus === 'closed') {
        filtered = filtered.filter((app) => !APPLICATION_STATUSES[app.status]?.isActive);
      } else {
        filtered = filtered.filter((app) => app.status === filterStatus);
      }
    }

    // Sort by last updated (most recent first)
    filtered.sort((a, b) => b.lastUpdated - a.lastUpdated);

    return filtered;
  };

  // Get statistics
  const getStats = () => {
    const active = applications.filter((app) => APPLICATION_STATUSES[app.status]?.isActive && !app.isArchived);
    const interviews = applications.filter((app) =>
      ['phone_screen', 'interview', 'technical_assessment'].includes(app.status) && !app.isArchived
    );
    const offers = applications.filter((app) => app.status === 'offer_received' && !app.isArchived);
    const accepted = applications.filter((app) => app.status === 'accepted');
    const rejected = applications.filter((app) => app.status === 'rejected');

    return {
      total: applications.length,
      active: active.length,
      interviews: interviews.length,
      offers: offers.length,
      accepted: accepted.length,
      rejected: rejected.length,
      responseRate: applications.length > 0
        ? Math.round((applications.filter((app) => app.status !== 'applied' && app.status !== 'ghosted').length / applications.length) * 100)
        : 0,
    };
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  // Handle status update dialog
  const handleStatusUpdate = () => {
    if (selectedApp && newStatus) {
      updateApplicationStatus(selectedApp.id, newStatus, statusNote);
      setShowStatusDialog(false);
      setNewStatus('');
      setStatusNote('');
      // Refresh selected app
      const updated = applications.find((a) => a.id === selectedApp.id);
      setSelectedApp(updated);
    }
  };

  // Handle new application
  const handleCreateApplication = () => {
    if (newAppData.jobId) {
      createApplication(newAppData.jobId, newAppData.resumeId, newAppData.notes);
      setShowNewAppDialog(false);
      setNewAppData({ jobId: '', resumeId: '', notes: '' });
    }
  };

  const stats = getStats();
  const filteredApps = getFilteredApplications();

  // Separate active and closed applications
  const activeApps = filteredApps.filter((app) => APPLICATION_STATUSES[app.status]?.isActive);
  const closedApps = filteredApps.filter((app) => !APPLICATION_STATUSES[app.status]?.isActive);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Application Tracker
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Track your job applications from submission to offer
            </Typography>
          </Box>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowNewAppDialog(true)}
              sx={{ px: 3 }}
              disabled={jobs.length === 0}
            >
              Track Application
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Total Applications', value: stats.total, color: '#8B5CF6', icon: SendIcon },
          { label: 'Active', value: stats.active, color: '#06B6D4', icon: WorkIcon },
          { label: 'In Interviews', value: stats.interviews, color: '#10B981', icon: VideocamIcon },
          { label: 'Offers', value: stats.offers, color: '#EC4899', icon: LocalOfferIcon },
          { label: 'Response Rate', value: `${stats.responseRate}%`, color: '#F59E0B', icon: TimelineIcon },
        ].map((stat, index) => (
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `1px solid ${stat.color}30`,
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <stat.icon sx={{ color: stat.color, fontSize: 28, mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Filter Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select
            value={filterStatus}
            label="Filter Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Applications</MenuItem>
            <MenuItem value="active">Active Only</MenuItem>
            <MenuItem value="closed">Closed Only</MenuItem>
            <MenuItem value="applied">Applied</MenuItem>
            <MenuItem value="interview">In Interview</MenuItem>
            <MenuItem value="offer_received">Offers</MenuItem>
          </Select>
        </FormControl>

        <Button
          size="small"
          startIcon={showArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
          onClick={() => setShowArchived(!showArchived)}
          sx={{
            color: showArchived ? 'primary.main' : 'text.secondary',
            borderColor: showArchived ? 'primary.main' : 'rgba(255,255,255,0.2)',
          }}
          variant={showArchived ? 'outlined' : 'text'}
        >
          {showArchived ? 'Hide Archived' : 'Show Archived'}
        </Button>
      </Box>

      {/* Tabs for Active/Closed */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          sx={{
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': { color: 'primary.main' },
            },
          }}
        >
          <Tab label={`Active (${activeApps.length})`} />
          <Tab label={`Closed (${closedApps.length})`} />
        </Tabs>
      </Box>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <TimelineIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              No applications tracked yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Start tracking your job applications to monitor your progress
            </Typography>
            {jobs.length === 0 ? (
              <Button
                variant="outlined"
                onClick={() => onNavigate?.('jobs')}
              >
                Add Jobs First
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowNewAppDialog(true)}
              >
                Track Your First Application
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {(tabValue === 0 ? activeApps : closedApps).map((app, index) => {
            const job = getJobById(app.jobId);
            const resume = getResumeById(app.resumeId);
            const statusInfo = APPLICATION_STATUSES[app.status];
            const StatusIcon = statusInfo?.icon || WorkIcon;
            const isExpanded = expandedApp === app.id;

            if (!job) return null;

            return (
              <Grid size={{ xs: 12, md: 6 }} key={app.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    sx={{
                      position: 'relative',
                      overflow: 'visible',
                      opacity: app.isArchived ? 0.6 : 1,
                      '&:hover': {
                        boxShadow: `0 8px 32px ${statusInfo?.color}30`,
                        borderColor: `${statusInfo?.color}50`,
                      },
                    }}
                  >
                    {/* Status Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${statusInfo?.color}30 0%, ${statusInfo?.color}15 100%)`,
                        border: `2px solid ${statusInfo?.color}`,
                        boxShadow: `0 4px 12px ${statusInfo?.color}40`,
                      }}
                    >
                      <StatusIcon sx={{ fontSize: 14, color: statusInfo?.color }} />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: statusInfo?.color,
                          fontSize: '0.7rem',
                        }}
                      >
                        {statusInfo?.label}
                      </Typography>
                    </Box>

                    {/* Fair Chance Badge */}
                    {job.isFairChance && (
                      <Tooltip title="Fair Chance Employer" arrow>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -12,
                            left: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.5,
                            borderRadius: 2,
                            background: 'rgba(16, 185, 129, 0.2)',
                            border: '2px solid #10B981',
                          }}
                        >
                          <VerifiedUserIcon sx={{ fontSize: 14, color: '#10B981' }} />
                        </Box>
                      </Tooltip>
                    )}

                    <CardContent sx={{ p: 3, pt: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {job.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {job.company}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                            sx={{ color: 'text.secondary' }}
                          >
                            <ExpandMoreIcon
                              sx={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                              }}
                            />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Timeline Preview */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Applied {formatRelativeTime(app.appliedDate)}
                        </Typography>
                        {app.timeline.length > 1 && (
                          <>
                            <ArrowForwardIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Updated {formatRelativeTime(app.lastUpdated)}
                            </Typography>
                          </>
                        )}
                      </Box>

                      {/* Quick Actions */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setSelectedApp(app);
                            setShowStatusDialog(true);
                          }}
                          sx={{
                            borderColor: `${statusInfo?.color}50`,
                            color: statusInfo?.color,
                            '&:hover': {
                              borderColor: statusInfo?.color,
                              background: `${statusInfo?.color}15`,
                            },
                          }}
                        >
                          Update Status
                        </Button>
                        {job.url && (
                          <IconButton
                            size="small"
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: 'text.secondary' }}
                          >
                            <LinkIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => toggleArchive(app.id)}
                          sx={{ color: 'text.secondary' }}
                        >
                          {app.isArchived ? <UnarchiveIcon fontSize="small" /> : <ArchiveIcon fontSize="small" />}
                        </IconButton>
                      </Box>

                      {/* Expanded Timeline */}
                      <Collapse in={isExpanded}>
                        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimelineIcon sx={{ fontSize: 18 }} />
                            Application Timeline
                          </Typography>

                          <Box sx={{ position: 'relative', pl: 3 }}>
                            {/* Timeline line */}
                            <Box
                              sx={{
                                position: 'absolute',
                                left: 8,
                                top: 8,
                                bottom: 8,
                                width: 2,
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: 1,
                              }}
                            />

                            {app.timeline.map((entry, idx) => {
                              const entryStatus = APPLICATION_STATUSES[entry.status];
                              const EntryIcon = entryStatus?.icon || WorkIcon;

                              return (
                                <Box
                                  key={idx}
                                  sx={{
                                    position: 'relative',
                                    mb: 2,
                                    '&:last-child': { mb: 0 },
                                  }}
                                >
                                  {/* Timeline dot */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      left: -19,
                                      width: 20,
                                      height: 20,
                                      borderRadius: '50%',
                                      background: entryStatus?.color,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <EntryIcon sx={{ fontSize: 12, color: 'white' }} />
                                  </Box>

                                  <Box
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.03)',
                                      border: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: entryStatus?.color }}>
                                        {entryStatus?.label}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {formatDate(entry.date)}
                                      </Typography>
                                    </Box>
                                    {entry.notes && (
                                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {entry.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              );
                            })}
                          </Box>

                          {/* Next Action */}
                          {app.nextAction && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F59E0B', mb: 0.5 }}>
                                Next Action
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {app.nextAction}
                                {app.nextActionDate && ` - Due ${formatDate(app.nextActionDate)}`}
                              </Typography>
                            </Box>
                          )}

                          {/* Delete Button */}
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => deleteApplication(app.id)}
                            >
                              Delete Application
                            </Button>
                          </Box>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Status Update Dialog */}
      <Dialog
        open={showStatusDialog}
        onClose={() => {
          setShowStatusDialog(false);
          setNewStatus('');
          setStatusNote('');
        }}
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
        <DialogTitle sx={{ fontWeight: 600 }}>
          Update Application Status
        </DialogTitle>
        <DialogContent>
          {selectedApp && (
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                {getJobById(selectedApp.jobId)?.title} at {getJobById(selectedApp.jobId)?.company}
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={newStatus}
                  label="New Status"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {Object.entries(APPLICATION_STATUSES).map(([key, status]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <status.icon sx={{ fontSize: 18, color: status.color }} />
                        <span>{status.label}</span>
                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                          - {status.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes (optional)"
                placeholder="Add details about this update... (e.g., interviewer name, feedback received, next steps)"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => {
              setShowStatusDialog(false);
              setNewStatus('');
              setStatusNote('');
            }}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleStatusUpdate}
            disabled={!newStatus}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Application Dialog */}
      <Dialog
        open={showNewAppDialog}
        onClose={() => {
          setShowNewAppDialog(false);
          setNewAppData({ jobId: '', resumeId: '', notes: '' });
        }}
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
        <DialogTitle sx={{ fontWeight: 600 }}>
          Track New Application
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Job</InputLabel>
              <Select
                value={newAppData.jobId}
                label="Select Job"
                onChange={(e) => setNewAppData({ ...newAppData, jobId: e.target.value })}
              >
                {jobs.map((job) => {
                  const alreadyTracked = applications.some((app) => app.jobId === job.id);
                  return (
                    <MenuItem key={job.id} value={job.id} disabled={alreadyTracked}>
                      <Box>
                        <Typography variant="body1">{job.title}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {job.company}
                          {alreadyTracked && ' (Already tracking)'}
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Resume Used (optional)</InputLabel>
              <Select
                value={newAppData.resumeId}
                label="Resume Used (optional)"
                onChange={(e) => setNewAppData({ ...newAppData, resumeId: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {resumes.map((resume) => (
                  <MenuItem key={resume.id} value={resume.id}>
                    {resume.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Application Notes (optional)"
              placeholder="Any notes about this application..."
              value={newAppData.notes}
              onChange={(e) => setNewAppData({ ...newAppData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => {
              setShowNewAppDialog(false);
              setNewAppData({ jobId: '', resumeId: '', notes: '' });
            }}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateApplication}
            disabled={!newAppData.jobId}
            startIcon={<AddIcon />}
          >
            Start Tracking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ApplicationTrackerView;
