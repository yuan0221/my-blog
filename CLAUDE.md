# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Prisma - Generate client after schema changes
npx prisma generate --schema=prisma/schema.prisma

# Prisma - Run database migrations
npx prisma migrate dev --name <migration-name> --schema=prisma/schema.prisma
```

## Architecture Overview

### Dual API Structure
This project uses Umi's API route system with two parallel structures:
- **`src/api/`** - TypeScript source files (development)
- **`api/`** - Compiled JavaScript functions (production/Vercel deployment)

When working on APIs, edit files in `src/api/`. Umi builds and compiles them to `api/` automatically.

### Database (Prisma + PostgreSQL)
- **Schema**: `prisma/schema.prisma`
- **Generated client**: `generated/prisma/client/` (custom output path)
- **Connection**: Uses `@prisma/adapter-pg` with PostgreSQL

**Important**: Always run `npx prisma generate` after modifying the schema. The generated client is output to `generated/prisma/` (not the default `node_modules/.prisma`).

### Authentication Flow
1. JWT tokens generated via `signToken()` in `src/utils/jwt.ts`
2. Tokens stored in HTTP-only cookies via `res.setCookie('token', ...)`
3. Protected routes verify tokens using `verifyToken()`
4. Passwords hashed with bcryptjs (8 salt rounds)

### API Request/Response Types
Umi provides `UmiApiRequest` and `UmiApiResponse` types. Import from `umi`:
```typescript
import { UmiApiRequest, UmiApiResponse } from "umi";
```

### Prisma Client Instantiation
Each API handler should instantiate PrismaClient per-request:
```typescript
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Always disconnect after use
await prisma.$disconnect()
```

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `UPSTASH_REDIS_REST_URL` - Redis cache URL (optional)
- `UPSTASH_REDIS_REST_TOKEN` - Redis token (optional)

### Frontend Routes (`.umirc.ts`)
- `/` - Home page
- `/posts/create` - Post creation
- `/login` - Login page
- `/register` - Registration page
- `/posts/:postId` - Individual post view
