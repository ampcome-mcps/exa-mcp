# Essential Scripts

This directory contains essential build and test scripts for the exa-mcp-server project.

## Scripts

### `validate-build.js`
Validates that the TypeScript build was successful.

### `debug-nango.js`
Tests Nango authentication and connection.

### `test-exa-api.js`
Tests Exa API connectivity with Nango credentials.

### `test-cli.js`
Tests CLI connectivity and MCP transport.

### `update-all.js`
Updates npm and all dependencies to latest versions.

### `cleanup.js`
Removes obsolete files and optimizes the codebase.

## Usage

```bash
# Run validation
npm run validate

# Test authentication
npm run test:nango
npm run test:exa
npm run test:cli

# Update everything
npm run update
```
