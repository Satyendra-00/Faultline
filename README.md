<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# FaultLine

This repository contains the current FaultLine client, API routes, and local development server.

## Run Locally

Prerequisite: Node.js

1. Install dependencies with `npm install`
2. Set the required keys in `.env`
3. Start local development with `npm run dev`

## Production

Build with `npm run build`

Start the production server with `npm start`

## Vercel

The project includes `vercel.json` and an `api/[...path].ts` serverless entry for deployment on Vercel.
