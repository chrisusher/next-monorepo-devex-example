# next-monorepo-devex-example

A reference architecture for large Next.js monorepos using **pnpm workspaces** and **Turborepo**, demonstrating how to maintain excellent developer experience (DevEx) as a codebase grows.

## Why this structure?

Large Next.js repositories often crawl on developer laptops. The root causes are usually:

- Monolithic "shared" packages that pull everything into every module graph
- API routes containing all business logic alongside framework code
- TypeScript server needing to process huge barrel-file exports
- Accidental client/server boundary violations discovered too late
- Heavy build tools (Prisma, Tailwind, etc.) running against the whole repo on every change

This repo shows a structure that avoids all of these problems from day one.

---

## Repository structure

```text
.
├── apps/
│   └── web/                       # Next.js 15 App Router application
│       ├── app/
│       │   ├── api/
│       │   │   ├── me/route.ts
│       │   │   └── projects/
│       │   │       ├── route.ts          # GET list, POST create
│       │   │       └── [id]/route.ts     # GET single
│       │   ├── dashboard/page.tsx
│       │   └── layout.tsx
│       ├── lib/
│       │   └── server/
│       │       └── get-request-context.ts
│       └── tests/
│           └── api/
│               └── projects.integration.test.ts
│
└── packages/
    ├── config/                    # Shared TypeScript configs
    ├── utils/                     # Pure utility functions
    ├── api-contracts/             # Zod schemas, DTOs, shared types
    ├── domain/                    # Pure business rules (no framework, no DB)
    ├── db/                        # Data access layer
    ├── auth/                      # Auth logic (server-side only)
    ├── server/                    # Use-cases/application layer
    ├── api-client/                # Typed browser-safe API callers
    └── ui/                        # Reusable React components
```

---

## Package responsibilities

### `packages/config`
Shared TypeScript `tsconfig` presets. Every other package extends one of these.

### `packages/utils`
Pure, side-effect-free helper functions: date formatting, object manipulation, currency formatting. No framework coupling. Imported by both server and client code.

### `packages/api-contracts`
The stable boundary between frontend and backend. Contains:
- Zod schemas for all API inputs and outputs
- Derived TypeScript types (`z.infer<typeof ...>`)
- No DB, no fetch, no Next.js imports

### `packages/domain`
Pure business rules, e.g. permission checks. Zero dependencies on frameworks, databases, or HTTP. Easy to unit test in isolation.

### `packages/db`
Thin data access layer. In a real app this would wrap Prisma, Drizzle, or Kysely. Exposes **narrow repository interfaces** — consumers get focused functions, not the whole ORM.

### `packages/auth`
Server-side session/auth helpers. Replace the stub `getSession` with next-auth, lucia, better-auth, or clerk. Exports are fine-grained so client code can never accidentally import server auth logic.

### `packages/server`
**The application layer.** Use-cases that compose domain + db + auth. This is what Next.js API routes delegate to. Written with dependency injection so it's easy to test without a running server.

### `packages/api-client`
Browser-safe typed fetch wrappers. Uses the same Zod schemas from `api-contracts` to validate responses at runtime. Lives here instead of in page components so fetch logic isn't duplicated.

### `packages/ui`
Reusable, unstyled (Tailwind-ready) React components: `Button`, `Table`, etc. No server-only deps — safe to import in any client or server component.

---

## Dependency graph

```
apps/web ──> ui, api-client, api-contracts, auth, server, utils
server   ──> domain, db, auth, api-contracts, utils
domain   ──> api-contracts, utils
api-client ──> api-contracts
db       ──> api-contracts, utils
ui       ──> (React peer deps only)
```

**Strictly disallowed:**

- `ui → db`
- `ui → auth`
- `domain → next`
- `domain → prisma`
- `api-contracts → next`
- Any client component importing from `packages/server`

---

## How API routes are kept thin

Instead of putting logic inside the route handler:

```ts
// ❌ Bad: everything in the route
export async function GET(req) {
  const session = await getSession(req)
  const projectId = req.params.id
  const project = await db.project.findUnique({ where: { id: projectId } })
  if (project.ownerId !== session.user.id) throw new Error('Forbidden')
  return Response.json(project)
}
```

The route delegates to a use-case:

```ts
// ✅ Good: thin route, logic in @repo/server
export async function GET(req, { params }) {
  const { id } = await params
  try {
    const project = await getProject({ projectId: id, request: req })
    return NextResponse.json(project)
  } catch (err) {
    if (err instanceof NotFoundError) return NextResponse.json({ error: err.message }, { status: 404 })
    // ...
  }
}
```

This keeps the Next.js app as a **delivery layer**, not the home of all logic.

---

## Testing strategy

### Test pyramid

```
┌─────────────────────────────────┐
│         E2E (Playwright)        │  Few, slow — full user flows
├─────────────────────────────────┤
│    Integration (Vitest)         │  Some — API route wiring
├─────────────────────────────────┤
│   Component (RTL + Vitest)      │  Some — UI package behaviour
├─────────────────────────────────┤
│     Unit (Vitest, fast)         │  Many — utils, domain, server use-cases
└─────────────────────────────────┘
```

### Where each test type lives

| Test type | Location | What it validates |
|---|---|---|
| Unit | `packages/utils/src/*.test.ts` | Pure helpers |
| Unit | `packages/domain/src/**/*.test.ts` | Business rules |
| Unit | `packages/api-contracts/src/*.test.ts` | Schema correctness |
| Unit (use-case) | `packages/server/src/**/*.test.ts` | Application layer (mocked deps) |
| Component | `packages/ui/src/*.test.tsx` | React component behaviour |
| Integration | `apps/web/tests/api/*.test.ts` | HTTP status codes, route wiring |

### Why dependency injection matters for testing

Server use-cases accept a `deps` object:

```ts
export async function getProject(
  input: { projectId: string; request: Request },
  deps = {
    requireUser,
    findProjectById: projectRepo.findById,
    ensureCanReadProject,
  },
)
```

In tests, override only what you need:

```ts
const deps = {
  requireUser: vi.fn().mockResolvedValue(stubUser),
  findProjectById: vi.fn().mockResolvedValue(null),  // simulate not-found
  ensureCanReadProject: vi.fn(),
}
await expect(getProject({ projectId: '...', request: req }, deps))
  .rejects.toThrow(NotFoundError)
```

No running server, no database, no test containers needed.

---

## Getting started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

### Install dependencies

```bash
pnpm install
```

### Run dev server

```bash
pnpm dev
# or just the web app:
cd apps/web && pnpm dev
```

### Run all tests

```bash
pnpm test
```

### Run specific test types

```bash
# Unit tests only (fast, no builds required)
pnpm test:unit

# Integration tests (API route handlers)
cd apps/web && pnpm test:integration

# A single package
cd packages/utils && pnpm test
```

### Type-check the whole repo

```bash
pnpm typecheck
```

---

## Developer experience wins this structure provides

### 1. Smaller module graphs
Each package exports only what it declares in `package.json#exports`. Turbopack and the TypeScript server can stop crawling early.

### 2. Faster TypeScript
Splitting a giant `shared` package into focused packages means `tsserver` processes a fraction of the code on any given change. Each package has its own `tsconfig.json`.

### 3. No accidental client/server leaks
The package boundary (`@repo/server` vs `@repo/api-client`) makes it structurally impossible to import DB code in browser bundles.

### 4. Better Turborepo caching
Turborepo caches per package. A change in `@repo/ui` doesn't invalidate the `@repo/domain` build cache. This speeds up both CI and local development.

### 5. Independent test runs
Each package can run its tests without starting the Next.js app. `pnpm test` in `packages/utils` is instant.

### 6. Clear ownership
When you need to change a permission rule, you open `packages/domain`. When you need a new API route, you open `apps/web/app/api`. There's one obvious place for every kind of change.

---

## Replacing the stubs

This example uses in-memory data and stub auth to run without infrastructure. To make it production-ready:

| Stub | Replace with |
|------|-------------|
| `packages/db/src/client.ts` | Prisma, Drizzle, or Kysely client |
| `packages/auth/src/server/get-session.ts` | next-auth, lucia, better-auth, or clerk |
| `packages/db/src/projects/index.ts` | Real Prisma queries |
| `packages/db/src/users/index.ts` | Real Prisma queries |

All other code is unaffected — the dependency injection pattern means you only swap the leaves, not the whole tree.

---

## Turborepo task graph

```
build
  └─ depends on ^build (package deps build first)

test
  └─ depends on ^build

typecheck
  └─ depends on ^typecheck

dev
  └─ runs in parallel across all apps
```

Run any command across the whole repo:

```bash
turbo build          # build everything in order
turbo test --filter=@repo/utils   # test one package
turbo dev --filter=@repo/web      # start just the web app
```

---

## Recommended next steps for production repos

1. **Add ESLint import boundary rules** — use `eslint-plugin-import` or `@nx/enforce-module-boundaries` to enforce the dependency graph at lint time.
2. **Add Playwright for E2E tests** — `apps/web/playwright.config.ts`, tests under `apps/web/tests/e2e/`.
3. **Wire real auth** — drop in next-auth or clerk into `packages/auth`.
4. **Add Prisma** — replace the in-memory db in `packages/db` with a real Prisma schema and generated client.
5. **Add Tailwind** — configure `content` globs to scan only `apps/web` and `packages/ui` to keep CSS builds fast.
6. **Add Storybook** — place stories next to components in `packages/ui`.
7. **Split `packages/auth`** — as the repo grows, consider `packages/auth-server` and `packages/auth-client`.