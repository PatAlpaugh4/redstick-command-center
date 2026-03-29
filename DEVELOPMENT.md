# Development Guide

## Getting Started

See README.md for initial setup.

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Run Database

```bash
# Terminal 1: Database
docker-compose up db

# Terminal 2: App
npm run dev
```

### 3. Access Development Tools

- App: http://localhost:3000
- Prisma Studio: `npm run db:studio`
- API: http://localhost:3000/api

## Debugging

### Next.js DevTools

- Use React DevTools browser extension
- Check Network tab for API calls
- Console for errors

### VS Code Debugging

Launch configuration provided in `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "attach",
  "name": "Next.js Debug",
  "port": 9229
}
```

### Common Issues

**Build fails**

```bash
# Clear cache
rm -rf .next
npm run build
```

**Database connection error**

- Check DATABASE_URL in .env.local
- Ensure PostgreSQL is running
- Verify connection string format

**TypeScript errors**

```bash
# Check types
npx tsc --noEmit
```

## Code Organization

### Adding a New Component

1. Create in `src/components/ui/`
2. Add TypeScript interfaces
3. Add accessibility features
4. Create story/example
5. Add tests
6. Export from `src/components/ui/index.ts`

### Adding a New Hook

1. Create in `src/hooks/`
2. Add JSDoc comments
3. Add usage example
4. Export from `src/hooks/index.ts`

### Adding a New API Route

1. Create in `src/app/api/[route]/route.ts`
2. Add validation
3. Add error handling
4. Document in API.md

## Testing

### Unit Tests

```bash
npm run test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage

```bash
npm run test:coverage
```

### E2E Tests

```bash
npm run test:e2e
```

## Performance

### Bundle Analysis

```bash
npm run analyze
```

### Lighthouse

```bash
npm run lighthouse
```

## Environment Variables

Development-specific:

```env
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret
DATABASE_URL=postgresql://localhost:5432/redstick
```

## Git Workflow

### Branch Naming

- `feature/description`
- `bugfix/description`
- `docs/description`
- `refactor/description`

### Commit Messages

Follow conventional commits:
- `feat: add deal pipeline`
- `fix: resolve table overflow`
- `docs: update API reference`
- `refactor: optimize queries`

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
