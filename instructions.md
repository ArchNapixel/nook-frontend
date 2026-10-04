# Instructions

Nook-Frontend

## Stack

- Next.js (App Router)
- Tailwind CSS

## Setup

```bash
npx create-next-app@latest . --tailwind --app
npm run dev
```

App runs at http://localhost:3000.

## Conventions

- Pages and layouts live in `app/`.
- Style with Tailwind utility classes; avoid custom CSS unless necessary.
- Default to Server Components; add `"use client"` only when needed.
