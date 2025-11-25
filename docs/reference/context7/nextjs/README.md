# Context7 Libraries for Next.js Workflow

The Next.js workflow can query these actual context7 libraries:

## Recommended Libraries

| Library ID | Purpose |
|------------|---------|
| `/vercel/next.js` | Official Next.js documentation (1900+ code snippets) |
| `/websites/nextjs` | Comprehensive Next.js docs (7300+ code snippets) |
| `/react-dev/react.dev` | React documentation |
| `/tailwindlabs/tailwindcss` | Tailwind CSS documentation |
| `/shadcn-ui/ui` | shadcn/ui component library |
| `/typescript/typescript` | TypeScript documentation |
| `/nextauthjs/docs` | NextAuth.js authentication |
| `/tanstack/query` | TanStack Query (React Query) |
| `/vercel/commerce` | Next.js Commerce patterns |

## Usage

Agents query these via:
```javascript
// Resolve library
mcp__context7__resolve-library-id({ libraryName: "nextjs" })

// Get docs
mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/vercel/next.js",
  topic: "app router"
})
```

The agents will pull actual, up-to-date documentation from these real libraries when they need architectural guidance, code patterns, or API references.