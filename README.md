# Cherry Location

A map-based directory for cherry gardens in Bulgaria. Garden owners can register, manage their listings, and visitors can browse, search, and filter gardens on an interactive map.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Prisma ORM, SQLite, NextAuth.js, Leaflet

---

## Prerequisites

- Node.js 18+
- npm

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

> For development you can use any string for `NEXTAUTH_SECRET`. In production use a strong random value.

### 3. Initialize the database

Run migrations to create the database schema:

```bash
npm run prisma:migrate
```

### 4. Seed demo data

Populate the database with demo users and gardens:

```bash
npm run db:seed
```

This creates the following demo accounts (password: `demo123`):

| Email | Name | Role |
|-------|------|------|
| `owner1@demo.bg` | Черешова градина Тракия | GARDEN |
| `owner2@demo.bg` | Black Sea Cherry Farm | GARDEN |
| `owner3@demo.bg` | Родопски череши | GARDEN |
| `owner4@demo.bg` | Балканска черешова ферма | GARDEN |
| `admin@demo.bg` | Администратор Черешово | ADMIN |

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run prisma:migrate` | Run database migrations |
| `npm run db:seed` | Seed demo data |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |
| `npm run lint` | Run ESLint |

---

## Database

The app uses SQLite via Prisma ORM. The database file is located at `prisma/dev.db`.

To inspect or edit data directly, use Prisma Studio:

```bash
npm run prisma:studio
```

To reset and re-seed the database:

```bash
# Delete the database file and re-run migrations + seed
rm prisma/dev.db
npm run prisma:migrate
npm run db:seed
```
