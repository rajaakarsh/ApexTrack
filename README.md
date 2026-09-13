# ApexTrack

ApexTrack is a focused web operating system designed for competitive exam preparation. It helps students organize study schedules, run deep work focus sessions with ambient audio, track syllabus progress, analyze mock test performance, and log conceptual errors.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)

## Features

- **Dashboard & Overview**: High-level view of daily focus time, task completion rates, syllabus progress, exam countdowns, and primary weakness diagnostics.
- **Study Planner**: List and Kanban task management supporting priority levels, subject tagging, schedule search/filters, and ICS calendar file export.
- **Deep Work Focus Timer**: Supports Pomodoro, Flow (stopwatch), and Custom timer modes integrated with a Web Audio ambient sound engine (40Hz Gamma, Rain, Brown noise, Lo-Fi) and Zen mode.
- **Syllabus Progress Tracker**: Multi-tier syllabus tracking for exams including JEE Advanced, JEE Main, NEET, GATE CS, UPSC CSE, and CAT, with support for attaching reference links and notes.
- **Mock Test Analytics**: Log full-length, sectional, or chapterwise test scorecards with subject breakdowns and score progression charts.
- **Error & Mistake Log**: Categorize study mistakes (conceptual, calculation, formula, time management, silly mistake) to diagnose weak chapters and define corrective rules.
- **Daily Questions Counter**: Log problem-solving counts by subject against daily targets, complete with goal celebratory visual effects.
- **Community & Accountability**: Connect with peer study partners, send nudges, create study group cohorts, and view study-time leaderboard rankings.
- **Authentication & Data Portability**: Supports Supabase Google OAuth authentication, offline guest mode, local data merging, and JSON data export.

## Requirements

- Node.js (v18.0.0 or higher recommended)
- npm or an equivalent Node package manager

## Installation

1. Clone the repository and navigate to the project root:
   ```bash
   cd ApexTrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env.local` or `.env` file in the root directory based on `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

If these environment variables are missing or unconfigured, the application runs in offline/guest mode using local storage.

## Available Scripts

In the project directory, you can run:

- **Start development server**:
  ```bash
  npm run dev
  ```
- **Build for production**:
  ```bash
  npm run build
  ```
- **Run Oxlint linter**:
  ```bash
  npm run lint
  ```
- **Preview production build locally**:
  ```bash
  npm run preview
  ```

## Project Structure

```
ApexTrack/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI elements, auth guards, and layout shells
│   ├── context/            # React context providers (AuthContext)
│   ├── hooks/              # Custom React hooks (e.g., useSupabaseSync)
│   ├── lib/                # Utility modules, audio synthesizer, ICS exporter, and Supabase client
│   ├── pages/              # Application page views (Dashboard, Planner, Timer, Syllabus, Analytics, etc.)
│   ├── services/           # Supabase service layer for API and database operations
│   ├── store/              # Zustand state management stores
│   ├── types/              # TypeScript interfaces and type definitions
│   ├── App.tsx             # App routing and layout configurations
│   └── main.tsx            # Application entry point
├── supabase/               # Database SQL schemas and migration scripts
├── package.json            # Project dependencies and script definitions
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.ts          # Vite build tool configuration
```