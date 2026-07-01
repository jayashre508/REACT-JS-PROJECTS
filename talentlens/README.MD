# TalentLens – Hiring Operations Platform

<div align="center" style="margin: 30px;">
  <h2>🔍 TalentLens</h2>
  <p><strong>Enterprise Recruitment Software built with Refine + Ant Design</strong></p>
</div>

## Overview

TalentLens is a full-featured hiring operations platform that solves real recruitment workflow problems — from candidate sourcing to offer acceptance. Built on top of [Refine](https://refine.dev) with Ant Design, it provides a structured, data-driven approach to managing the entire hiring lifecycle.

## Features

| Module | Capabilities |
|---|---|
| **Dashboard** | KPI cards, hiring funnel, upcoming interviews, source of hire, recent offers |
| **Candidates** | Profiles, skills, experience, notice period, pipeline stage, ratings, drawer view |
| **Job Openings** | Role listings, salary ranges, priority, status, applicant counts |
| **Recruiters** | Productivity metrics, active roles, time-to-hire, hired count |
| **Interviews** | Scheduling, structured feedback, ratings, recommendations |
| **Offers** | Generation, acceptance tracking, joining date, negotiation rounds |
| **Departments** | Headcount, open roles, quarterly hiring, avg time-to-hire |
| **Reports** | Hiring funnel, offer acceptance rate, source of hire, recruiter productivity |

## Hiring Pipeline Stages

`Applied → Screening → Technical Interview → Manager Round → HR Round → Offer → Hired / Rejected`

## Getting Started

```bash
npm install
npm run dev
```

**Demo credentials:**
- Email: `michael.scott@dundermifflin.com`
- Password: `demodemo`

## Tech Stack

- **Framework:** Refine v5
- **UI:** Ant Design v5
- **Routing:** React Router v7
- **Data:** NestJS Query / GraphQL
- **Language:** TypeScript

## Business Problems Solved

1. **No visibility into pipeline** → Hiring funnel with stage-by-stage counts
2. **Scattered candidate data** → Unified candidate profiles with skills, experience, notice period
3. **Interview feedback lost** → Structured feedback with ratings and recommendations
4. **Offer tracking in spreadsheets** → Centralized offer management with negotiation history
5. **No recruiter accountability** → Productivity metrics per recruiter
6. **Unknown source effectiveness** → Source of hire analytics
7. **Department hiring blind spots** → Per-department trends and time-to-hire benchmarks

## Project Architecture

```
src/
├── components/
│   ├── layout/          # Header, Sidebar, Avatar, Account Settings
│   ├── stat-card.tsx    # Reusable KPI card
│   ├── status-tag.tsx   # Color-coded status tags for all entities
│   └── text.tsx         # Typography component
├── config/
│   └── resources.tsx    # All 8 Refine resource definitions
├── data/
│   └── mock.ts          # Typed mock data for all recruitment entities
├── pages/
│   ├── home/            # Dashboard with analytics
│   ├── candidates/      # Candidate list + profile drawer
│   ├── job-openings/    # Job listings with filters
│   ├── recruiters/      # Recruiter productivity table
│   ├── interviews/      # Interview schedule + feedback drawer
│   ├── offers/          # Offer tracking table
│   ├── departments/     # Department hiring overview
│   └── reports/         # Full analytics page
├── providers/           # Auth + Data providers (preserved)
└── utilities/           # Helpers (preserved)
```

## License

MIT
