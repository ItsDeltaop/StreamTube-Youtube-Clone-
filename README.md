# StreamTube — MERN Video Sharing App

A responsive YouTube-inspired learning project built with React + Vite, Express, MongoDB, and JWT. This is an original demo app and is not affiliated with YouTube.

## Features
- Responsive video home feed, collapsible sidebar, category chips (6+), and title search
- Register/login with validated inputs, hashed passwords, JWT auth
- Video detail/player page with views, likes/dislikes, and comment CRUD
- Authenticated channel creation and channel page
- Owner-only video create, edit, and delete
- MongoDB models for users, channels, videos, and embedded comments
- Seed script for demo videos and optional sample account
- ES modules throughout; Vite instead of Create React App

## Requirements
- Node.js 20+ and npm
- MongoDB local instance or MongoDB Atlas connection string

## Setup
1. Copy `.env.example` to `server/.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Install dependencies in separate terminals:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Seed demo content (MongoDB must be running):
   ```bash
   cd server && npm run seed
   ```
4. Start the API:
   ```bash
   cd server && npm run dev
   ```
5. Start the frontend in another terminal:
   ```bash
   cd client && npm run dev
   ```
6. Open the URL printed by Vite (normally http://localhost:5173).

The frontend uses `VITE_API_URL` from `client/.env` if supplied; otherwise it uses `http://localhost:5000/api`.

## Environment
`server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/streamtube
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```
Optional `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Demo account
The seed script creates `demo@streamtube.dev` / `DemoPass123!` if absent. Change it before using anywhere public.

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/videos`, `GET /api/videos/:id`, `POST /api/videos`, `PATCH /api/videos/:id`, `DELETE /api/videos/:id`
- `POST /api/videos/:id/reaction` (like/dislike), `POST /api/videos/:id/comments`
- `PATCH /api/videos/:id/comments/:commentId`, `DELETE /api/videos/:id/comments/:commentId`
- `POST /api/channels`, `GET /api/channels/:id`, `GET /api/channels/mine`

## Notes
- Videos are represented by external video URLs; this starter does not upload large video files.
- Use trusted URLs and configure CORS/environment secrets before deployment.
- The PDF brief requests a short demo video as a submission item; record a walkthrough after running the app.

## Suggested walkthrough
Register → log in → browse/search/filter → open video → react/comment → create channel → add/edit/delete a video → verify responsive layout.
