# Recluta

**Know if you're competitive before you apply.**

Recluta is a job application readiness platform that helps professionals assess their competitiveness for specific roles. Stop wasting time on applications you won't win—focus on opportunities where you can succeed.

## The Problem

95% of job applications are wasted effort. Most job seekers apply to roles they're not competitive for and never hear back. Recluta solves this by giving you instant feedback on how well you match a position before you apply.

## Features

- **Resume Management** — Create and manage multiple resume profiles with structured data capture
- **Job Tracking** — Save job postings you're considering and organize requirements
- **Match Analysis** — Compare your resume against job requirements with instant scoring
- **Skills Gap Detection** — See exactly which skills you have and which you're missing
- **Smart Matching** — Fuzzy matching handles variations (e.g., "JavaScript" matches "JS", "React.js")
- **Actionable Insights** — Get personalized recommendations based on your match percentage

## Tech Stack

- **Framework:** React 19
- **UI Library:** Material UI (MUI) 7
- **Animations:** Framer Motion
- **Build Tool:** Vite
- **Styling:** Emotion
- **Storage:** Browser LocalStorage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/beckomw/recluta-demo.git
cd recluta-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Add Your Resume** — Enter your skills, experience, and qualifications
2. **Save Job Postings** — Paste job descriptions and requirements
3. **Compare** — Select a resume and job to see your match score
4. **Decide** — Use the analysis to prioritize where to apply

### Match Score Guide

| Score | Verdict | Recommendation |
|-------|---------|----------------|
| 80%+ | Excellent Match | Apply with confidence |
| 60-79% | Good Match | Highlight transferable skills |
| 40-59% | Moderate Match | Consider addressing skill gaps first |
| <40% | Low Match | May need significant upskilling |

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

### Other Platforms

Build the project and deploy the `dist` folder to any static hosting service (Netlify, GitHub Pages, AWS S3, etc.).

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header
│   ├── HeroSection.jsx     # Landing hero
│   ├── ResumeView.jsx      # Resume management
│   ├── JobsView.jsx        # Job posting tracker
│   ├── ComparisonView.jsx  # Match analysis
│   ├── DashboardView.jsx   # Overview dashboard
│   └── Footer.jsx          # Site footer
├── App.jsx                 # Main application
├── main.jsx                # Entry point
└── theme.js                # MUI theme configuration
```

## Data Privacy

All data is stored locally in your browser's localStorage. Nothing is sent to external servers. Your resume and job data stays on your device.

## License

MIT

---

Built to help you focus on opportunities you can win.
