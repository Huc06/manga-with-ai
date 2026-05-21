# MangaWithAI

AI-powered manga creation Mini App for MiniPay on Celo. Create manga stories from prompts, continue with character consistency, and share publicly.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS 4, Wagmi/Viem (Celo)
- **Backend**: Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Storage**: Cloudflare R2 (with base64 fallback for local dev)
- **AI**: Google Gemini API (`gemini-2.5-pro` for text, `gemini-3-pro-image-preview` for images)
- **Monorepo**: npm workspaces

## Quick Start

### 1. Prerequisites
- Node.js 20+
- Docker (for PostgreSQL)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 2. Setup

```bash
# Clone and install
git clone <repo-url> manga-with-ai
cd manga-with-ai
npm install

# Start database
docker compose up -d

# Configure environment
cp .env.example packages/api/.env
# Edit packages/api/.env — required: GEMINI_API_KEY, JWT_SECRET

# Run migrations
cd packages/api
npx prisma migrate dev --name init
cd ../..

# Start dev servers
npm run dev
```

### 3. Access
- Frontend: http://localhost:3000
- API: http://localhost:4000
- Prisma Studio: `cd packages/api && npx prisma studio`

## Project Structure

```
packages/
├── api/          # Express backend
│   ├── prisma/   # Schema & migrations
│   └── src/
│       ├── lib/gemini/   # Gemini API (text + image)
│       ├── lib/storage.ts # R2 upload (fallback base64)
│       ├── routes/       # REST endpoints
│       └── workers/      # Job processing
├── shared/       # Shared TypeScript types
└── web/          # Next.js frontend
    └── src/
        ├── app/          # Pages (App Router)
        ├── components/   # React components
        ├── hooks/        # useAutoConnect
        └── lib/          # wagmi, api, minipay utils
```

## Features

- **Create Story** — Enter prompt + optional character reference images → AI generates full manga page
- **Continue Story** — Write next chapter with Story Bible consistency
- **Character References** — Upload up to 5 character images for consistent generation
- **My Library** — View/manage all stories
- **Public Sharing** — Publish stories with shareable links
- **Regenerate** — Re-generate chapter or individual panels
- **Profile** — View wallet info, disconnect

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /v1/session/minipay | No | Wallet login |
| POST | /v1/stories | Yes | Create story |
| GET | /v1/stories | Yes | List my stories |
| GET | /v1/stories/:id | Yes | Story detail |
| PATCH | /v1/stories/:id | Yes | Update story |
| POST | /v1/stories/:id/publish | Yes | Publish story |
| POST | /v1/stories/:id/chapters | Yes | Continue story |
| GET | /v1/stories/:id/chapters/:cid | Yes | Chapter detail |
| GET | /v1/jobs/:id | Yes | Job status |
| POST | /v1/chapters/:id/regenerate | Yes | Regenerate chapter |
| POST | /v1/panels/:id/regenerate | Yes | Regenerate panel |
| GET | /v1/public/feed | No | Public feed |
| GET | /v1/public/stories/:slug | No | Public story |
| GET | /v1/public/stories/:slug/chapters/:cid | No | Public chapter |

## AI Pipeline

```
User prompt + character refs
    ↓
gemini-2.5-pro → Story Bible (characters, locations, world rules)
    ↓
gemini-2.5-pro → Scene Plan (panel-by-panel descriptions)
    ↓
gemini-3-pro-image-preview → Full manga page image (2K, 2:3 ratio)
    ↓
Upload to R2 → URL saved in DB → Frontend displays
```

## Storage Strategy

| Image Type | Storage | Reason |
|-----------|---------|--------|
| Manga pages (AI output) | Cloudflare R2 → URL in DB | Large files, served to readers |
| Character references (user upload) | Base64 in DB | Small, needed as Gemini API input |

If R2 is not configured (no env vars), manga pages fallback to base64 in DB.

## MiniPay Integration

- Auto-connects via injected `window.ethereum` provider
- Wallet-based auth: sign nonce → JWT (7 day expiry)
- Chains: Celo Mainnet + Celo Sepolia
- Mobile-first UI (375px+)

## Environment Variables

```bash
# Required
GEMINI_API_KEY=         # Google AI Studio key
JWT_SECRET=             # Any secret string
DATABASE_URL=           # PostgreSQL connection string

# Optional (R2 — falls back to base64 without these)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# App
API_PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Deploy

| Component | Recommended | Free tier |
|-----------|------------|-----------|
| Frontend | Vercel | Yes |
| Backend | Railway | $5/mo |
| Database | Railway PostgreSQL | Included |
| Storage | Cloudflare R2 | 10GB free |
