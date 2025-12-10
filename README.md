# Recluta

**Know if you're competitive before you apply.**

## Introduction

Recluta is a client-side job application readiness platform that analyzes how well your skills match job requirements—before you spend hours on applications. Upload your resume, paste a job posting, and get an instant match score with actionable insights.

No signup. No backend. Your data never leaves your browser.

## Why Recluta?

The average corporate job receives **250+ applications**. Yet 95% of applicants never hear back because they're applying to roles they're not competitive for. Most job seekers waste countless hours tailoring resumes for positions where they have little chance.

**Recluta fixes this by answering one question: Should I apply?**

Instead of blindly applying everywhere, you can:
- See your match percentage before investing time
- Identify exact skill gaps to address
- Prioritize applications where you're genuinely competitive
- Track your application pipeline in one place

This isn't about limiting opportunities—it's about strategic focus. Apply to fewer jobs, but the right jobs.

## Installation

```bash
# Clone the repository
git clone https://github.com/beckomw/recluta-demo.git
cd recluta-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

**Requirements:** Node.js 18+

### Production Build

```bash
npm run build    # Creates optimized build in dist/
npm run preview  # Preview production build locally
```

### Deploy

Deploy to Vercel with `vercel` or push to any static host (Netlify, GitHub Pages, AWS S3). The `dist` folder contains everything needed.

## Use Case

**Sarah is a frontend developer looking for her next role.**

1. **Creates her profile** — Uploads her PDF resume. Recluta extracts her skills: React, TypeScript, CSS, Jest, Git.

2. **Saves interesting jobs** — Pastes job descriptions from LinkedIn. Recluta auto-extracts required skills from each posting.

3. **Compares before applying** —
   - Job A (Startup): 85% match. Missing: GraphQL. → *Apply confidently, mention willingness to learn GraphQL*
   - Job B (Enterprise): 45% match. Missing: Angular, RxJS, Java. → *Skip for now, too many gaps*
   - Job C (Agency): 72% match. Missing: Figma. → *Apply, highlight transferable design skills*

4. **Tracks applications** — Logs applied jobs, interview dates, and status. Dashboard shows her pipeline at a glance.

**Result:** Sarah applies to 8 targeted jobs instead of 40 random ones. Gets 3 interviews instead of 0.

### Match Score Guide

| Score | Verdict | Action |
|-------|---------|--------|
| 80%+ | Excellent | Apply with confidence |
| 60-79% | Good | Apply, highlight transferable skills |
| 40-59% | Moderate | Consider upskilling first |
| <40% | Low | Focus elsewhere or bridge significant gaps |

## Features

| Feature | Description |
|---------|-------------|
| **Resume Profiles** | Create multiple resumes, upload PDFs for auto-extraction |
| **Job Tracking** | Save postings with auto-extracted skill requirements |
| **Match Analysis** | Fuzzy skill matching (React.js = React = ReactJS) |
| **Gap Detection** | See exactly what you're missing for each role |
| **Application Pipeline** | Track status from Applied → Interview → Offer |
| **Dashboard** | Stats, progress tracking, and gamified XP system |
| **Fair Chance Detection** | Identifies employers known for fair hiring practices |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| UI | Material UI 7 |
| Animations | Framer Motion |
| Build | Vite |
| PDF Parsing | PDF.js |
| Storage | localStorage (100% client-side) |

## Project Structure

```
src/
├── components/
│   ├── ResumeView.jsx          # Resume management + PDF parsing
│   ├── JobsView.jsx            # Job tracking + skill extraction
│   ├── ComparisonView.jsx      # Match analysis engine
│   ├── ApplicationTrackerView.jsx  # Application pipeline
│   ├── DashboardView.jsx       # Stats + gamification
│   ├── HeroSection.jsx         # Landing page
│   ├── Header.jsx              # Navigation
│   └── Footer.jsx              # Footer + data controls
├── App.jsx                     # Layout + routing
├── theme.js                    # Dark mode theme
└── main.jsx                    # Entry point
```

## Privacy

**Your data stays on your device.** Recluta runs entirely in your browser with no backend, accounts, or external API calls. All data persists in localStorage and can be cleared anytime from the footer.

## License

MIT

---

**Stop spraying and praying. Start applying strategically.**
