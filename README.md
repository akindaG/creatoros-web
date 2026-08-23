# CreatorOS AI Web

Premium Next.js frontend for CreatorOS AI, an AI-powered Social Growth Intelligence Platform.

## Project repositories

- Frontend: https://github.com/akindaG/creatoros-web
- Backend: https://github.com/akindaG/creatoros-api
- Documentation: https://github.com/akindaG/creatoros-docs

## MVP screens

- Landing page
- Login, registration and forgot password
- Dashboard
- Content Studio
- AI Content Assistant
- Content Calendar
- Analytics
- Growth Insights
- Facebook and Instagram connections
- Settings and profile management

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- FastAPI backend integration

## Local development

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Open `http://localhost:3000`.

The backend defaults to `http://localhost:8000`. Set `NEXT_PUBLIC_API_URL` when using another FastAPI URL.

## Validation

```bash
npm run lint
npm run build
```

GitHub Actions runs both checks on feature branches and pull requests.

## Design direction

The UI follows the submitted CreatorOS Figma system: dark navy surfaces, violet intelligence accents, mint success signals, glass panels, compact data-rich cards, responsive navigation and focused creator workflows.

Version 1.0 intentionally limits social integrations to Facebook and Instagram.

For architecture, local setup, testing, deployment and final demo documentation, see the `creatoros-docs` repository.
