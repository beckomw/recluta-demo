# RecruitFlow MVP - Project Charter

## Project Overview
**Project Name**: RecruitFlow MVP  
**Vision**: A streamlined, free recruiting and sales platform for engineers, designers, entrepreneurs, and small agencies  
**Tagline**: "The only recruiting and sales platform you'll ever need"

## Core Features (MVP Scope)
1. **Dashboard** - Progress tracking and deadlines
2. **Entity Management** - Clients, Candidates, Companies, Jobs
3. **Project Assignment** - Link entities to projects
4. **AI Productivity Assistant** - Realistic timeline suggestions
5. **Basic CRUD Operations** - Create, read, update, delete all entities

## Technology Stack
- **Runtime**: Bun
- **Frontend**: HTML/CSS/JavaScript (SolidJS compatible structure)
- **Backend**: Bun with Elysia or Express-style routes
- **Database**: SQLite (for MVP simplicity)
- **API**: RESTful endpoints


## Core Value Proposition
- **Free & Open Source: Leverage free open source tools**:

- **All-in-One Platform: Source clients, candidates, and companies in one place**:

- **AI-Powered Productivity: Realistic timeline suggestions and progress tracking**:

- **Streamlined Workflow: Save time with efficient project management**:








## Database Schema Logic

```sql
-- Core Entities
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    industry TEXT,
    size TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    skills TEXT,
    experience_level TEXT,
    resume_url TEXT,
    status TEXT DEFAULT 'active'
);

CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    status TEXT DEFAULT 'open',
    salary_range TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    deadline DATE,
    status TEXT DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    ai_productivity_score INTEGER
);

-- Relationship Tables
CREATE TABLE project_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    client_id INTEGER,
    candidate_id INTEGER,
    job_id INTEGER,
    role TEXT,
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE ai_productivity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    suggested_timeline TEXT,
    confidence_score INTEGER,
    factors_considered TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);


```

I'm working on a MVP privately incorporating different open source tools and I should have an MVP soon. 


```
recruitflow-mvp/
├── package.json
├── server.js
├── database/
│   ├── db.js
│   └── init.js
├── models/
│   ├── Company.js
│   ├── Client.js
│   ├── Candidate.js
│   ├── Project.js
│   └── AIProductivity.js
├── routes/
│   ├── dashboard.js
│   ├── companies.js
│   ├── clients.js
│   ├── candidates.js
│   └── projects.js
└── public/
    ├── index.html
    ├── dashboard.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```


## Phase 1: Foundation (Week 1)

- Set up Bun project with SQLite (I've been playing around with Node.js, Tauri, and some other stuff but this seems the fastest honestly with just using Vanilla JavaScript.)

- Create database schema and basic CRUD operations

- Build basic HTML templates for each entity

## Phase 2: Core Features (Week 2)
- Implement project assignment logic

- Create dashboard with progress tracking

- Build basic AI productivity calculator

## Phase 3: Polish (Week 3)
- Add search and filtering

- Implement deadline tracking

- Create responsive design

- Add basic analytics