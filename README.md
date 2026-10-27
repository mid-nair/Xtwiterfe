# Xtwiterfe

React 18 + TypeScript + Vite + Tailwind CSS v4, with TanStack Query (server state) and Zustand (auth and theme).

## Features

- Home timeline with For you / Following feeds and infinite scroll
- Threaded replies with a dedicated post page and reply composer
- Likes, reposts, bookmarks with optimistic updates
- Profiles with Posts / Replies / Media / Reposts tabs, follow and message actions
- Explore with post and people search, plus trending topics
- Notifications with unread badges and mark-as-read
- Direct messages with conversation list, polling thread view and new-message search
- Edit profile (name, bio, location, website, avatar/banner) with optional image upload
- Compose posts with an uploaded image or pasted image URL

## Run

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:5173, proxies /api to http://localhost:4000
npm run build
```

Image uploads use `POST /uploads/image`. The backend returns 503 until Cloudinary credentials
(`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) are configured; pasting an
image URL always works.

## Structure

```
src/
  app/          App shell and providers
  config/       env, constants, navigation
  types/        API contracts (snake_case, matches the backend schema)
  lib/          apiClient, query keys, cache helpers, formatters, validators
  stores/       Zustand: auth (persisted), theme (persisted)
  services/     One thin module per API area; no React in here
  hooks/        React Query hooks (feeds, engagement, follow, profile, notifications, messages)
  components/   ui/ primitives, layout/, tweet/, widgets/, user/, messages/
  routes/       Router, ProtectedRoute, GuestRoute, error boundary
  pages/        One component per route (lazy-loaded)
```

Data flow: `page → hook → service → apiClient`. Components never call axios directly.

## API contract the backend must satisfy

IDs are strings. List endpoints return `{ data: T[], next_cursor: string | null }` unless noted.

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/auth/login`, `/auth/register` | returns `{ token, user }` |
| GET | `/timeline/home?feed_type=for_you\|following&cursor&limit` | top-level posts only |
| POST | `/tweets` | returns the created `Tweet` |
| GET | `/tweets/:tweetId` | `{ tweet, parent }` |
| GET | `/tweets/:tweetId/replies?cursor&limit` | oldest first |
| POST | `/tweets/:id/engage` | `{ action }`: LIKE, UNLIKE, REPOST, UNREPOST, BOOKMARK, UNBOOKMARK |
| GET | `/users/:username` | profile plus `is_following` |
| GET | `/users/:username/tweets?tab=posts\|replies\|media\|reposts&cursor&limit` | cursor feed |
| PATCH | `/users/me` | display name, bio, location, website, avatar/banner URLs |
| GET | `/users/search?q=` | people search |
| GET | `/users/suggestions` | `SuggestedUser[]` |
| POST / DELETE | `/users/:id/follow` | follow / unfollow |
| GET | `/explore/tweets?q=&cursor&limit` | post search |
| GET | `/explore/users?q=` | `SuggestedUser[]` |
| GET | `/notifications?cursor` | notifications feed |
| GET | `/notifications/unread-count` | `{ count }` |
| POST | `/notifications/:id/read`, `/notifications/read-all` | 204 |
| GET | `/conversations` | conversation list with `unread_count` |
| POST | `/conversations` | `{ user_id }`, opens or creates a 1:1 conversation |
| GET | `/conversations/unread-count` | `{ count }` |
| GET / POST | `/conversations/:id/messages` | newest-first pages / `{ content }` |
| POST | `/conversations/:id/read` | 204 |
| POST | `/uploads/image` | multipart field `image`, returns `{ url, public_id }` |
| GET | `/bookmarks` | cursor feed |
| GET | `/trends` | `Trend[]` |
