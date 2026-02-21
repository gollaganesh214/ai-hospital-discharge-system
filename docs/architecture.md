# Architecture

## Overview

- React + Vite frontend with authentication and admin pages.
- Express backend with modular routes and JWT auth.
- PostgreSQL database managed via Prisma.

## Backend modules

- `patients`: create/list patient records
- `discharges`: create AI-assisted discharge summaries

## Data flow

Frontend -> REST API -> Prisma -> Postgres

## AI summary

This demo uses a simple server-side summarizer stub. Replace `generateDischargeSummary()` with a real LLM call if needed.
