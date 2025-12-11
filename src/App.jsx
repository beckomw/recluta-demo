import React, { useState, useEffect } from 'react';
import { Box, Container, IconButton, Typography, Tooltip, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import CloseIcon from '@mui/icons-material/Close';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ResumeView from './components/ResumeView';
import JobsView from './components/JobsView';
import ComparisonView from './components/ComparisonView';
import DashboardView from './components/DashboardView';
import ApplicationTrackerView from './components/ApplicationTrackerView';
import PrivacyPage from './components/PrivacyPage';
import Footer from './components/Footer';
import FirstLaunchWarning from './components/FirstLaunchWarning';
import { checkAndMigrateLocalData } from './services/dataService';

const navItems = [
  { id: 'resume', label: 'My Profile', icon: DescriptionIcon },
  { id: 'jobs', label: 'Track Jobs', icon: WorkIcon },
  { id: 'comparison', label: 'Compare & Insights', icon: CompareArrowsIcon },
  { id: 'applications', label: 'My Applications', icon: TimelineIcon },
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
];

function App() {
  const [currentView, setCurrentView] = useState('resume');
  const [showHero, setShowHero] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check and migrate data on app load
  useEffect(() => {
    const migration = checkAndMigrateLocalData();
    if (migration.migrated) {
      console.log(`Data migrated from v${migration.fromVersion} to v${migration.toVersion}`);
    }
  }, []);

  const handleGetStarted = () => {
    setShowHero(false);
  };

  const NavContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 2,
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Box
              onClick={() => {
                setCurrentView(item.id);
                setMobileOpen(false);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 3,
                cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(6, 182, 212, 0.3) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive
                    ? 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography
                sx={{
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease',
                }}
              >
                {item.label}
              </Typography>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    marginLeft: 'auto',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                  }}
                />
              )}
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        isMobile={isMobile}
        onMenuClick={() => setMobileOpen(true)}
        onLogoClick={() => setShowHero(true)}
      />

      <AnimatePresence mode="wait">
        {showHero && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection onGetStarted={handleGetStarted} />
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ flex: 1, display: 'flex' }}>
        {!isMobile && (
          <Box
            sx={{
              width: 280,
              minHeight: 'calc(100vh - 80px)',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              pt: 3,
              position: 'sticky',
              top: 80,
              height: 'fit-content',
            }}
          >
            <NavContent />
          </Box>
        )}

        {isMobile && (
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            PaperProps={{
              sx: {
                width: 280,
                background: 'rgba(15, 15, 35, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
              <IconButton onClick={() => setMobileOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <NavContent />
          </Drawer>
        )}

        <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          <Container maxWidth="xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentView === 'resume' && <ResumeView />}
                {currentView === 'jobs' && <JobsView onNavigate={setCurrentView} />}
                {currentView === 'comparison' && <ComparisonView onNavigate={setCurrentView} />}
                {currentView === 'applications' && <ApplicationTrackerView onNavigate={setCurrentView} />}
                {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
                {currentView === 'privacy' && <PrivacyPage onNavigate={setCurrentView} />}
              </motion.div>
            </AnimatePresence>
          </Container>
        </Box>
      </Box>

      <Footer onNavigateToPrivacy={() => setCurrentView('privacy')} />

      {/* First Launch Warning */}
      <FirstLaunchWarning />
    </Box>
  );
}

export default App;
