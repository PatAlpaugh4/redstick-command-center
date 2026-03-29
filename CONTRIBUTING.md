# Contributing to Redstick Command Center

Thank you for your interest in contributing!

## Code of Conduct

Be respectful, constructive, and professional.

## How to Contribute

### Reporting Bugs

1. Check if issue already exists
2. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Open a GitHub issue
2. Describe the feature and use case
3. Discuss with maintainers

### Pull Requests

#### Before Submitting

- [ ] Branch is up to date with main
- [ ] Tests pass (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] TypeScript compiles (`npm run build`)
- [ ] Accessibility checked

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing performed
- [ ] Accessibility verified

## Screenshots
If UI changes
```

## Development Setup

See README.md for setup instructions.

## Code Style

### TypeScript

- Strict mode enabled
- Explicit return types on functions
- No `any` types

### React

- Functional components with hooks
- Props interfaces defined
- Default exports for pages

### CSS/Tailwind

- Use Tailwind classes
- Custom classes in globals.css
- Dark mode support required

### Testing

- Unit tests for utilities
- Component tests for UI
- E2E tests for critical flows

## Accessibility Requirements

All contributions must maintain WCAG 2.1 AA compliance:
- Proper ARIA labels
- Keyboard navigation
- Color contrast (4.5:1)
- Screen reader support

## Questions?

Open an issue or contact maintainers.
