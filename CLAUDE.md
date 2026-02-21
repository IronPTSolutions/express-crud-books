# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (uses `node --watch`)
- **Run all tests**: `npm test` (runs `cross-env NODE_ENV=test vitest run`)
- **Run a single test file**: `npx cross-env NODE_ENV=test vitest run tests/books.test.js`
- **Test coverage**: `npm run test:coverage`
- **Seed database**: `npm run seed` (drops DB, creates 5 users + 1000 books with faker)

## Architecture

Express 5 REST API with MongoDB/Mongoose. ES modules throughout (`"type": "module"`).

**Request flow**: `app.js` → morgan logging → JSON body parser → `checkAuth` middleware → `/api` router → controller → error handler

### Key patterns

- **Auth**: Cookie-based sessions. `checkAuth` middleware extracts `sessionId` from cookies, loads Session + populated User into `req.session`. Bypasses auth for `POST /api/users` (registration) and `POST /api/users/login`.
- **Models** use `toJSON` transforms: `_id` is removed (virtual `id` used instead), `password` is stripped from User JSON output. `versionKey: false` on all models.
- **User updates** use `findById` + `Object.assign` + `save()` (not `findByIdAndUpdate`) to trigger the pre-save password hashing middleware.
- **Book updates** use `findByIdAndUpdate` with `{ new: true, runValidators: true }`.
- **Error handling**: Centralized in `middlewares/errors.middleware.js`. Handles Mongoose `ValidationError` (400), `CastError` (404), MongoDB duplicate key E11000 (409), and http-errors status codes.
- **User-Book relation**: Book has a `user` ObjectId ref to User. User has a virtual `books` field (1:N).

### API routes (all under `/api`)

- Books: GET/POST `/books`, GET/PATCH/DELETE `/books/:id`
- Users: GET/POST `/users`, GET/PATCH/DELETE `/users/:id`, POST `/users/login`, GET `/users/profile`

## Testing

Tests use **Vitest** + **supertest**. Requires a running MongoDB instance. In test mode (`NODE_ENV=test`), connects to `booksdb_test` (appends `_test` to the DB URI). The global setup (`tests/setup.js`) drops the test DB before tests and closes the connection after. Tests run sequentially (`fileParallelism: false`). The Express server is not started in test mode; supertest handles requests directly via the app instance.
