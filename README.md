<div align="center">

# CreatorOS AI Web

### Next.js product interface for an AI-powered social growth platform

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

This repository contains the **web product surface** for CreatorOS AI. It connects to the FastAPI backend and implements authentication, content workflows, AI-assisted creation, social connections, scheduling, analytics, growth insights, and account settings.

> **Portfolio role:** evidence of full-stack integration and translating backend capabilities into a coherent user-facing workflow.


## Project repositories

- Frontend: https://github.com/akindaG/creatoros-web
- Backend: https://github.com/akindaG/creatoros-api
- Documentation: https://github.com/akindaG/creatoros-docs
- Experimental mobile extension: https://github.com/akindaG/creatoros-mobile

## Current web capabilities

- Public landing page
- Login, registration, forgot-password, and reset-password flows
- Protected dashboard
- Content Studio
- Media upload
- Draft CRUD
- AI Content Assistant
- Content Analyzer
- Post Now
- One-click Facebook Page and Instagram cross-post selection
- Content Calendar
- Single-platform and grouped multi-platform scheduling
- Analytics
- CSV export
- Growth Insights
- Facebook Page OAuth connection
- Instagram OAuth connection
- Facebook personal-profile assisted-share UX
- Settings and profile management
- Public privacy policy
- Public terms
- Public data-deletion instructions

## Actual stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- FastAPI backend integration

The current web package does not depend on Zustand, Recharts, or shadcn/ui. Those technologies should not be listed as implemented web dependencies in the final report unless they are added to the repository.

## Local development

~~~bash
cp .env.example .env.local
npm ci
npm run dev
~~~

Set:

~~~env
NEXT_PUBLIC_API_URL=http://localhost:8000
~~~

Open http://localhost:3000.

## Validation

~~~bash
npm run lint
npm run build
~~~

These checks provide linting, TypeScript validation through the production build, and Next.js production compilation. They are not frontend unit tests.

## Social publishing behavior

Automatic publishing targets:

- Facebook Page
- Instagram Business or Creator account

CreatorOS can publish or schedule both automatic targets from one user action when both are connected.

Facebook personal profiles use an assisted-share flow. CreatorOS prepares the content and opens Facebook, but the user completes the personal-timeline share manually.

The UI also exposes publishing readiness so users can distinguish simulated publishing from true live Meta publishing.

## AI behavior

The web client does not call Gemini directly. It uses the FastAPI AI endpoints.

The backend AI service uses:

- Google Gemini for caption generation, hashtag generation, and content analysis
- deterministic fallback when enabled

This keeps AI service details out of the frontend workflow.

## Design direction

The UI follows the submitted CreatorOS high-fidelity design direction with dark navy surfaces, violet intelligence accents, mint success signals, compact data-rich cards, responsive navigation, and focused creator workflows.

For the final report, use the Figma/high-fidelity screens as design evidence and real deployed screenshots as implementation and evaluation evidence.

## Version 1.0 scope

The approved core V1 product is the web application and supports Facebook and Instagram workflows.

The separate mobile repository is a post-MVP extension and should not be used to redefine the original V1 success criteria.

For architecture, data model, setup, testing, deployment, demo, and report alignment, see creatoros-docs.
