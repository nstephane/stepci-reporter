# Step CI Reporter Plugin

A comprehensive reporting plugin for Step CI that provides detailed test results storage and visualization.

## Features

- Store test results in PostgreSQL database
- Web dashboard for viewing test results
- Detailed test execution information including requests, responses, and checks
- Historical test run data and trends
- Performance metrics visualization

## Installation

```bash
npm install @stepci/plugin-reporter
```

## Configuration

Add the plugin to your Step CI workflow:

```yaml
version: "1.1"
name: API Test with Reporting
plugins:
  reporter:
    id: "@stepci/plugin-reporter"
    storage:
      type: "postgres"
      connection: "${DB_CONNECTION}"
    apiPort: 3000  # Optional, defaults to 3000
```

## Environment Variables

- `DB_CONNECTION`: PostgreSQL connection string
- `REPORTER_API_PORT`: Port for the reporting dashboard (optional)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/stepci-plugin-reporter.git
cd stepci-plugin-reporter
```

2. Install dependencies:
```bash
npm install
```

3. Build the plugin:
```bash
npm run build
```

4. Link for local development:
```bash
npm link
cd your-stepci-project
npm link @stepci/plugin-reporter
```

## Dashboard

The reporting dashboard is available at `http://localhost:3000` (or your configured port) and provides:

- Overview of test execution results
- Detailed test information including:
  - HTTP requests and responses
  - Test assertions and results
  - Performance metrics
  - Historical trends

## API Endpoints

- `GET /api/runs` - List test runs
- `GET /api/runs/:id` - Get specific test run details
- `GET /api/stats/:workflow` - Get workflow statistics

# Security Notes

## Known Vulnerabilities

There is a known vulnerability in a dependency chain:
- `jsonpath-plus` (through `@stepci/runner`) has a potential RCE vulnerability
- This is a dependency of Step CI core and cannot be fixed by this plugin
- In typical API testing scenarios, this should not pose a direct risk as:
  1. The JSONPath expressions are controlled by the test author
  2. The data being processed is from your own API responses

If you're concerned about this vulnerability:
1. Avoid using JSONPath expressions with untrusted input
2. Watch for updates from Step CI about this dependency
3. Consider using basic property access instead of JSONPath where possible

## Contributing

Contributions are welcome! Please read our contributing guidelines for more information.

## License

MIT