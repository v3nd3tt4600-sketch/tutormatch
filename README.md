# TutorMatch

TutorMatch is a tutoring marketplace where students can discover tutoring services, book sessions, and get AI-powered recommendations.

## Features

- Browse and filter tutoring services
- Create an account, sign in, and manage bookings
- View, reschedule, and cancel tutoring sessions
- Get AI-powered tutoring recommendations
- Manage services with administrator access

## Tech stack

- Frontend: React, Vite, and React Router
- Backend: Node.js, Express, and MongoDB with Mongoose
- AI recommendations: Anthropic API

## Requirements

- Node.js 20 or later
- MongoDB connection string
- Anthropic API key for AI recommendations

## Setup

1. Configure the backend:

   ```powershell
   cd server
   npm install
   Copy-Item .env.example .env
   ```

   Edit `server/.env` and set `MONGO_URI` and `JWT_SECRET`. Set `ANTHROPIC_API_KEY` to enable AI recommendations. Adjust other values as needed.

2. Configure the frontend:

   ```powershell
   cd ..\client
   npm install
   Copy-Item .env.example .env
   ```

   The example frontend configuration points to the local API at `http://localhost:5000/api`.

## Run locally

Open separate terminals from the project root:

```powershell
cd server
npm run dev
```

```powershell
cd client
npm run dev
```

Vite prints the local frontend URL when it starts.

To seed the database with the project's sample services, configure the backend environment and run:

```powershell
cd server
npm run seed
```

## Production build

Build the frontend from the `client` directory:

```powershell
npm run build
```
