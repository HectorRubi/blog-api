# Blog API

## Description

A lightweight RESTful API built with **NestJS** and TypeScript for managing blog posts, categories, and user accounts. The project uses **TypeORM** with PostgreSQL, **Passport** (local + JWT) for authentication, **bcrypt** for password hashing, and includes an **AI module** that integrates the OpenAI SDK for optional AI-powered features.

### Architecture diagram

```mermaid
graph LR
  Client -->|HTTP| API[Blog API (NestJS)]
  API --> Auth[Auth (Passport + JWT)]
  API --> Posts[Posts Module (TypeORM)]
  API --> Users[User Module]
  API --> AI[AI Module (OpenAI)]
  API --> DB[(Postgres)]
```

## Project setup

Create a `.env` file in the project root with the required environment variables. You can use the example below as a starting point:

```env
# Database configuration
DATABASE_HOST=<YOUR_DB_HOST>
DATABASE_PORT=<YOUR_DB_PORT>
DATABASE_USERNAME=<YOUR_DB_USERNAME>
DATABASE_PASSWORD=<YOUR_DB_PASSWORD>
DATABASE_NAME=<YOUR_DB_NAME>

# JWT secret (use a long, random value in production)
JWT_SECRET=<YOUR_JWT_SECRET>

# OpenAI API key (required for AI features)
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
```

Variable descriptions:

- `DATABASE_HOST` — hostname or IP of your Postgres server (e.g., `localhost`).
- `DATABASE_PORT` — Postgres port (default: `5432`).
- `DATABASE_USERNAME` — Postgres username used by the app.
- `DATABASE_PASSWORD` — Password for the Postgres user.
- `DATABASE_NAME` — Database name to connect to (e.g., `blog_db`).
- `JWT_SECRET` — Secret used to sign JWT tokens; keep this secret and use a secure, random value in production.
- `OPENAI_API_KEY` — API key for OpenAI; required if you want to use AI features like summary or image generation.
- `PORT` — Optional. Server port; if not set, the app defaults to `3000`.

After creating `.env`, run migrations and start the app:

```bash
# run migrations
$ npm run migrations:run

# start app
$ npm run start
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Features & API

### Features

- **User management**: create, read, update, delete users and profiles.
- **Authentication**: local login + JWT token generation (returns `access_token` on `/auth/login`).
- **Posts & categories**: full CRUD for posts and categories; category endpoints include listing posts in a category.
- **AI integration**: an `ai` module provides OpenAI-powered utilities (summary and image generation) via `OpenaiService`.
- **Database & migrations**: TypeORM with Postgres and migrations under `src/database/migrations`.
- **API docs**: interactive Swagger UI available when the app is running.

### Project structure (modules)

- `auth/` — authentication controllers, services and strategies (local + JWT).
- `user/` — user controllers, DTOs, entities and service; profile handling and user-related queries.
- `posts/` — posts & categories controllers, DTOs, entities and services.
- `ai/` — `OpenaiService` for AI features (requires OPENAI_API_KEY).
- `database/` — TypeORM config and migrations.

### Endpoints

**Auth**

- `POST /auth/login` — login with username/password; returns `{ user, access_token }`.

**User**

- `GET /user` — list users
- `POST /user` — create user (body: `CreateUserDto`)
- `GET /user/:id` — get user by id
- `PUT /user/:id` — update user
- `DELETE /user/:id` — delete user
- `GET /user/:id/profile` — get user's profile
- `GET /user/:id/posts` — list posts by user

**Posts** (JWT required for requests handled by `PostsController`)

- `POST /posts` — create a post (body: `CreatePostDto`); authenticated user's id is applied as the author
- `GET /posts` — list posts
- `GET /posts/:id` — get a post by id
- `PATCH /posts/:id` — update a post
- `DELETE /posts/:id` — delete a post

**Categories**

- `GET /categories` — list categories
- `GET /categories/:id` — get category
- `POST /categories` — create category
- `PATCH /categories/:id` — update category
- `DELETE /categories/:id` — delete category
- `GET /categories/:id/posts` — list posts in a category

> Note: Post endpoints are protected by JWT (see `PostsController` uses `AuthGuard('jwt')`). Update/delete operations currently do not perform an ownership check in the service layer — consider adding authorization if required.

### Typical workflows

1. **Sign up & login**: `POST /user` → `POST /auth/login` ⇒ receive `access_token`.
2. **Create content**: send `Authorization: Bearer <token>` header + `POST /posts` to create posts tied to your account.
3. **Explore content**: fetch posts, categories, user profiles and posts; use `GET /categories/:id/posts` to browse by category.
4. **Admin/maintenance**: run migrations (`npm run migrations:run`) and manage data as needed.

### Viewing API docs (Swagger)

- Start the app: `npm run start` (defaults to port `3000`).
- Open the interactive docs at: `http://localhost:3000/docs`.
- The raw Swagger JSON is available at: `http://localhost:3000/docs/swagger/json`.
- Use the **Authorize** button in Swagger to paste `Bearer <token>` for testing protected endpoints.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
