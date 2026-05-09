# Movie Browsing Full Stack Web Application

A protected movie browsing app built with React and Express. Users sign in with Clerk, browse TMDB movies through the backend, view movie details, sort/search/paginate results, and persist favorite movies in MongoDB Atlas.

## Tech Stack

Frontend:
- React + Vite for the client app
- Redux Toolkit for movie/favorite state
- React Router for protected routes and pages
- Tailwind CSS for responsive UI
- Clerk React SDK for sign up, sign in, forgot/reset password, and logout

Backend:
- Node.js + Express REST API
- MongoDB Atlas with Mongoose
- Clerk auth middleware
- TMDB API integration from the backend
- Swagger/OpenAPI documentation
- Clean MVC-style folders

## Features

- Clerk authentication: sign up, sign in, forgot password, reset password, logout
- Protected frontend routes: browse, movie details, favorites
- Protected backend APIs with Bearer token auth
- Movie list fetched through backend APIs
- Debounced title search
- Year sorting: ascending and descending
- Pagination with TMDB pagination metadata
- Movie details page
- Add/remove favorite movies
- User-specific favorites stored in MongoDB
- Loading, error, and empty states

## Folder Structure

```txt
movie-browsing-app/
  package.json
  README.md
  frontend/
    package.json
    src/
      components/
      pages/
      routes/
      services/
      store/
      styles/
  backend/
    package.json
    src/
      config/
      controllers/
      docs/
      middleware/
      models/
      routes/
      seeders/
      services/
      utils/
```

## Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie_browsing_app
CLIENT_URL=http://localhost:5173
TMDB_API_KEY=your_tmdb_api_key
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
AUTH_PROVIDER=clerk
```

For deployment, `CLIENT_URL` can contain multiple comma-separated frontend origins:

```env
CLIENT_URL=http://localhost:5173,https://your-frontend.vercel.app
```

## Run Locally

Install all dependencies:

```bash
npm run install:all
```

Run both apps:

```bash
npm run dev
```

Run frontend only:

```bash
cd frontend
npm run dev
```

Run backend only:

```bash
cd backend
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:5000
```

Swagger documentation:

```txt
https://movie-web-production-e629.up.railway.app/api/docs
```

## API Overview

All movie and favorite routes require:

```txt
Authorization: Bearer <Clerk session token>
```

Movie routes:

```txt
GET    /api/movies
GET    /api/movies?search=batman&page=1&sortBy=year&sortOrder=desc
GET    /api/movies/:id
```

Favorite routes:

```txt
GET    /api/favorites
POST   /api/favorites/:movieId
DELETE /api/favorites/:movieId
```

User route:

```txt
GET /api/users/me
```

## Deployment Links

Frontend deployed link:

```txt
https://movie-web-phi-ebon.vercel.app/
```

Backend deployed link:

```txt
https://movie-web-production-e629.up.railway.app/
```

Public GitHub repository:

```txt
https://github.com/sagardev-design/movie-web.git
```
