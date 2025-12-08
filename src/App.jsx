import React, { useState } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button, Tabs, Tab } from '@mui/material';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ResumeView from './components/ResumeView';
import JobsView from './components/JobsView';
import ComparisonView from './components/ComparisonView';
import DashboardView from './components/DashboardView';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState('resume');
  const [showHero, setShowHero] = useState(true);

  const handleGetStarted = () => {
    setShowHero(false);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentView(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />

      {showHero && <HeroSection onGetStarted={handleGetStarted} />}

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentView} onChange={handleTabChange} centered>
            <Tab label="Resume" value="resume" />
            <Tab label="Jobs" value="jobs" />
            <Tab label="Compare" value="comparison" />
            <Tab label="Dashboard" value="dashboard" />
          </Tabs>
        </Box>

        {currentView === 'resume' && <ResumeView />}
        {currentView === 'jobs' && <JobsView />}
        {currentView === 'comparison' && <ComparisonView />}
        {currentView === 'dashboard' && <DashboardView />}
      </Container>

      <Footer />
    </Box>
  );
}

export default App;
