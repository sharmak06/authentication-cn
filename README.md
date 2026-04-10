# AuthSystem Pro

Full-stack authentication web app built with Next.js 14 + Supabase.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI-style component architecture
- Supabase Auth + PostgreSQL
- Zustand
- Axios
- React Hook Form + Zod

## Routes

- `/` cinematic hero landing page
- `/login` login form
- `/register` registration form
- `/dashboard` protected user dashboard
- `/admin` protected admin dashboard

## Environment Variables

Copy `.env.example` into `.env.local` and fill the values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is needed for admin API actions such as listing and deleting users.

## Supabase Setup (Manual)

1. Create a new Supabase project.
2. Enable Email auth in Authentication > Providers.
3. Run SQL from `supabase/schema.sql` in SQL Editor.
4. Add the environment variables to `.env.local`.
5. Create your first admin user:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Security Notes

- SSR session handling is done via `@supabase/ssr` and `middleware.ts`.
- `/dashboard` and `/admin` are protected.
- `/admin` checks role before rendering and in API routes.
- RLS policies limit profile access and admin-level operations.

## Folder Structure

- `app/`
- `components/`
- `lib/supabase/`
- `store/`
- `types/`
# authentication-cn
# authentication-cn
# authentication-cn
