# Blog Frontend

Next.js 15 blog that pulls content from Sanity CMS.

## Setup

```bash
npm install
cp .env.local.example .env.local
# fill in .env.local with your Sanity project details
npm run dev
```

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (from sanity.io/manage) |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name, usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API version date e.g. `2024-01-01` |
| `SANITY_API_READ_TOKEN` | Read token for draft previews (optional) |
| `NEXT_PUBLIC_SITE_URL` | Production URL e.g. `https://yourdomain.com` |

## CMS

Content is managed via the Sanity Studio in `../cms/`.

```bash
cd ../cms && npm run dev
# opens localhost:3333
```
