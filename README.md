# Kindleway Zakaat Pro

Professional Zakaat Calculator built with Next.js (App Router) and Tailwind.

## Features
- Zakaat calculation (2.5%) across multiple asset categories
- Nisab editable in `content/settings.json`
- Admin dashboard with filter and CSV export
- In-memory logs (works reliably on Vercel serverless functions)

## Quick start
1. npm install
2. Copy .env.example to .env.local and set ADMIN_PASSWORD
3. npm run dev

## Deploy to Vercel
- Push repo to GitHub and import in Vercel
- Add Environment Variable `ADMIN_PASSWORD` in Vercel project settings
- Deploy; the site is ready to use
