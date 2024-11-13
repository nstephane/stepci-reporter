# Development Guide

## Project Structure

```
stepci-plugin-reporter/
├── src/
│   ├── core/        # Core types and interfaces
│   ├── storage/     # Database implementations
│   ├── api/         # REST API implementation
│   └── ui/          # Web dashboard
├── test/            # Test files
└── docs/            # Documentation
```

## Setting Up Development Environment

1. Prerequisites:
   - Node.js 16+
   - PostgreSQL
   - TypeScript

2. Database Setup:
```bash
# Create development database
createdb stepci_dev

# Create test database
createdb stepci_test
```

3. Environment Configuration:
```bash
# Create .env file
DB_CONNECTION=postgresql://localhost:5432/stepci_dev
TEST_DB_URL=postgresql://localhost:5432/stepci_test
```

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## Building

```bash
# Build TypeScript
npm run build

# Build UI
cd src/ui
npm run build
```

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Build project
4. Run tests
5. Create git tag
6. Publish to NPM

## Debugging

Enable debug logs:
```bash
DEBUG=stepci:reporter* npm test
```