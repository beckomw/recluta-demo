# Recluta - Job Application Readiness Platform

## Overview

Recluta is a web application that helps junior professionals in finance and engineering assess their job market competitiveness before applying. The platform allows users to upload/create resumes, track job postings, and compare their qualifications against job requirements to get match scores and identify skill gaps.

**Core Features:**
- Resume management with PDF parsing (via PDF.js)
- Job posting tracker
- Skills gap analysis and match scoring
- Gamification system (XP, levels, achievements, streaks)
- Bilingual support (English/Spanish)
- Dashboard with progress tracking

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack
- **Framework:** React 19 with Vite as the build tool
- **UI Library:** Material UI (MUI) v7 with Emotion for styling
- **Animations:** Framer Motion for smooth transitions
- **Styling:** Custom CSS with CSS variables for theming, dark mode by default

### Legacy JavaScript Modules
The project contains legacy vanilla JavaScript modules that appear to be from a previous iteration:
- `resume-manager.js` - Resume CRUD and PDF text extraction
- `job-manager.js` - Job posting management
- `comparison-engine.js` - Skills matching algorithm
- `gamification.js` - XP/achievement system
- `analytics.js` - Comparison history tracking
- `dashboard-manager.js` - Dashboard rendering
- `translations.js` - i18n translations object

**Note:** The main entry point is now `src/main.jsx` (React), but legacy JS files remain in the root.

### Data Persistence
- **Storage:** Browser LocalStorage for all data
- **No backend/database** - entirely client-side application
- Storage keys: `app_resumes`, `app_jobs`, `app_user_profile`, `app_comparison_history`, `app_user_progress`

### PDF Processing
- **Library:** PDF.js v3.11.174 loaded from CDN
- **Purpose:** Extract text from uploaded PDF resumes
- **Features:** Multi-page support, smart line detection, skill pattern matching

### Key Design Patterns
1. **Class-based modules** for each feature domain (legacy JS)
2. **Utility class** (`Utils`) for shared functions like ID generation and skill extraction
3. **Storage abstraction** for localStorage operations
4. **Event-driven UI** with DOM event listeners

### Build & Deployment
- **Build Tool:** Vite with React plugin
- **Deployment Target:** Vercel (static site)
- **Dev Server:** Port 5000, accessible on all interfaces

## External Dependencies

### NPM Packages
- `react` / `react-dom` v19 - UI framework
- `@mui/material` / `@mui/icons-material` v7 - Component library
- `@emotion/react` / `@emotion/styled` - CSS-in-JS styling
- `framer-motion` - Animation library
- `vite` / `@vitejs/plugin-react` - Build tooling

### CDN Resources
- **PDF.js v3.11.174** - PDF text extraction (loaded in HTML)
- **Google Fonts (Inter)** - Typography

### External Services
- **Vercel** - Hosting and deployment platform
- No backend APIs, authentication services, or databases required

## Recent Changes (December 2025)

### Major UI/UX Redesign
Complete visual overhaul with modern design patterns:

**Design System:**
- Dark theme with purple (#8B5CF6) and cyan (#06B6D4) gradient color scheme
- Glassmorphism effects (frosted glass cards with backdrop blur)
- Smooth animations using Framer Motion throughout the app
- Custom gradient scrollbars and hover effects

**Navigation:**
- Sidebar navigation replacing previous tab-based layout
- Responsive mobile drawer menu with floating action button
- Animated view transitions with page fade effects

**Components Redesigned:**
- `Header.jsx` - Modern logo with gradient text and animations
- `HeroSection.jsx` - Animated hero with floating benefit cards and gradient CTA
- `ResumeView.jsx` - Card-based resume management with modern forms
- `JobsView.jsx` - Flashy job cards with gradient accents
- `ComparisonView.jsx` - Animated circular score display with skill gap analysis
- `DashboardView.jsx` - Gamified stats with XP bar, levels, and achievements
- `Footer.jsx` - Polished footer with gradient elements

**Technical Notes:**
- Uses MUI v7 Grid `size` prop (not deprecated xs/sm/md props)
- Theme defined in `src/theme.js` with component overrides
- Global styles in `src/index.css` including gradient animation keyframes