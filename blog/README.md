# 📝 Fullstack Blog Engine – Next.js + tRPC + Applifting API

A fully featured, production-ready blog engine built with **Next.js App Router**, **tRPC**, **Tailwind CSS**, **Zod**, and the **Applifting Blog Engine API**. Markdown content, comments, API security, and full end-to-end type safety — ready to deploy.

---

## 🚀 Stack Overview

### 🔧 1. **Next.js 15 App Router**

- Uses the modern App Router paradigm (e.g., `app/articles/[articleId]/page.tsx`)
- Built-in server components for SEO & data fetching
- Async server functions to load data directly into pages

### 🧠 2. **tRPC + Zod**

- Fully typed API via `tRPC` routers
- Validated inputs using `Zod`
- End-to-end type inference from backend to frontend

### 🎨 3. **Tailwind CSS**

- Utility-first styling
- Responsive, clean design with `max-w-4xl`, `prose`, etc.
- Dark mode ready

### ✍️ 4. **Markdown Editor**

- Markdown stored in DB, rendered to HTML
- Editor: `@uiw/react-md-editor`
- Live WYSIWYG preview with Tailwind's prose classes

### 💬 5. **Comments System**

- Markdown support for comments
- `CommentSection` renders comment list and editor
- Comment schema includes `author`, `content`, `score`
- (Future) WebSocket-powered upvotes/downvotes

### 🪝 6. **Custom Hooks**

- `useImageHandler`: handles both upload + secure retrieval of protected images
- `useHydrated`: detects hydration mismatch to avoid flicker

### 🔐 7. **Authentication & API Security**

- Dual-header auth:
  - `X-API-KEY` (tenant)
  - `Authorization: Bearer <token>` (user)
- Secure fetch for protected endpoints (e.g., posting comments, creating articles)

### 📦 8. **tRPC Routers**

- `articleRouter`: CRUD for articles
- `commentRouter`: create + vote on comments
- `authRouter`: tenant registration & login
- All routers use Zod-validated schemas for inputs/outputs

### 🌐 9. **OpenAPI Integration: Applifting Blog Engine**

- `/articles` CRUD
- `/login` for authentication
- `/comments` for user interaction
- `/images` for uploading + fetching secure assets
- `/tenants` for tenant registration (used as "user registration")

---

## ✅ Features

- Full article CRUD
- Markdown rendering & editing
- Secure image uploads with preview
- Comment system with score & voting
- Protected API access with tokens
- Form validation with Zod
- Clean, reusable UI components

---

## 🧱 Folder Structure: T3 App Inspired

This project follows a modular folder structure inspired by the [T3 Stack](https://create.t3.gg/) principles:

- **Feature-first organization**: Pages and components grouped by domain (e.g. `articles`, `login`, `admin`)
- **App Router layout** with `app/` directory, nested routes, and dynamic segments
- **tRPC + Zod** for typed backend APIs
- **Separation of concerns** via folders like:
  - `hooks/` – reusable client-side logic
  - `components/` – structured UI by domain
  - `schemas/` – Zod schemas for strict typing
  - `types/` – API & domain-specific TypeScript types
  - `server/api/routers/` – backend logic (articles, auth, comments, etc.)
  - `trpc/` – client/server integration utilities
  - `lib/` – general utilities and helpers

This setup mirrors the philosophy of the T3 stack: **type safety**, **modularity**, and **developer happiness**.

---

## 🔧 Project Structure - Example

```bash
app/
  articles/
    [articleId]/page.tsx        # Detail page (SSR + hydration)
  create/page.tsx              # New article form
  layout.tsx                   # Shared layout

components/
  articles/ArticleCard.tsx     # Article list card
  articles/ArticleForm.tsx     # Markdown form + image upload
  CommentSection.tsx           # Comments & votes

server/api/
  routers/
    article.ts                 # tRPC routes for articles
    comment.ts                 # tRPC routes for comments
    auth.ts                    # login/register

schemas/
  article.schema.ts            # Zod schemas
  comment.schema.ts
  auth.schema.ts
```

---

## 🧪 Local Development

```bash
pnpm install
pnpm dev
```

You must define the following environment variables:

```env
API_KEY=<your-api-key>
AppLift_URL=<applifting-url>

NEXT_PUBLIC_AppLift_URL=<applifting-url>
NEXT_PUBLIC_API_KEY=<your-api-key>
```

Use `/login` to acquire an access token for secured actions.

---

## 📦 Deployment

This project works great on:

- **Vercel** (recommended)
- **Node.js hosting**
- **SSR-compatible platforms**

Supports SEO via SSR and preloading content via App Router.

---

## 👏 Credits

- API provided by **Applifting**
- Built with love using **Next.js, Tailwind, tRPC, Zod, and Markdown**

---

## 📬 Want Help or Improvements?

Open an issue or start a PR!
