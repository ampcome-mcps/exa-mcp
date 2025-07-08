# Exa MCP Server with Nango Authentication

A Model Context Protocol server with Exa for web search, academic paper search, and Twitter/X.com search. Provides real-time web searches with configurable tool selection, allowing users to enable or disable specific search capabilities. Supports customizable result counts, live crawling options, and returns content from the most relevant websites.

**Version 2.0.0** now uses **Nango** for authentication instead of direct API key management.

## Features

- **Real-time web search** using Exa AI
- **Academic paper search** from scholarly sources
- **Company research** with business intelligence
- **Web crawling** for content extraction
- **Competitor analysis** and market research
- **LinkedIn search** for professional networking
- **Wikipedia search** for factual information
- **GitHub search** for code repositories and projects
- **Nango authentication** for secure API access management
- **MCP Inspector support** for development and testing

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env with your Nango credentials
```

### 3. Build Project
```bash
npm run build
```

### 4. Run with MCP Inspector
```bash
npm run inspector
```

### 5. Or Run CLI Directly
```bash
npm run start:cli
```

## Authentication Setup

This server now uses Nango for authentication management. You'll need to configure your Nango environment variables in a `.env` file.

### 1. Create a `.env` file

Copy the example configuration:

```bash
# Nango Configuration
NANGO_CONNECTION_ID=your_connection_id_here
NANGO_INTEGRATION_ID=your_integration_id_here
NANGO_BASE_URL=https://api.nango.dev
NANGO_SECRET_KEY=your_secret_key_here

# Optional: Debug logging
DEBUG=true
```

### 2. Configure Nango

1. Set up your Nango account and create an integration for Exa API
2. Configure the connection with your Exa API credentials
3. Update the `.env` file with your Nango credentials:
   - `NANGO_CONNECTION_ID`: Your connection ID from Nango
   - `NANGO_INTEGRATION_ID`: Your integration ID from Nango
   - `NANGO_BASE_URL`: Nango API base URL (usually https://api.nango.dev)
   - `NANGO_SECRET_KEY`: Your secret key from Nango

### 3. Required Environment Variables

All Nango environment variables are required for the server to function:

- `NANGO_CONNECTION_ID` - Connection identifier
- `NANGO_INTEGRATION_ID` - Integration identifier  
- `NANGO_BASE_URL` - Nango API endpoint
- `NANGO_SECRET_KEY` - Authentication secret

## Installation & Build

### From NPM
```bash
npm install exa-mcp-server
```

### From Source
```bash
git clone <repository-url>
cd exa-mcp-server
npm install
npm run build
```

### Build Scripts
```bash
# Full build (TypeScript + validation)
npm run build

# TypeScript compilation only
npm run build:ts

# Clean build directory
npm run clean

# Watch mode for development
npm run watch

# Test CLI connectivity
npm run test:cli
```

## Usage

### With MCP Inspector (Recommended for Development)
```bash
# Run with MCP inspector for testing
npm run inspector
```

### With CLI Mode
```bash
# Run the CLI with MCP transport
npm run start:cli

# Or run directly (after build)
node dist/cli.js
```

### As Global Command
```bash
# Install globally
npm install -g exa-mcp-server

# Run from anywhere
exa-mcp-server
```

### Development Mode
```bash
# Run in development mode with Smithery
npm run dev

# Test CLI connectivity
npm run test:cli
```

## Project Structure

```
exa-mcp-server/
├── src/                    # Source TypeScript files
│   ├── auth/
│   │   └── nango.ts       # Nango authentication
│   ├── tools/             # Tool implementations
│   ├── utils/             # Utility functions
│   ├── index.ts           # Main server function
│   ├── cli.ts             # CLI entry point with MCP transport
│   └── types.ts           # Type definitions
├── dist/                  # Compiled JavaScript (generated)
│   ├── index.js           # Main server function
│   ├── cli.js             # CLI entry point
│   └── ...                # Other compiled files
├── scripts/               # Build and test scripts
├── .env                   # Environment variables
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Entry Points

### 1. CLI Entry Point (`dist/cli.js`)
- **Purpose**: MCP Inspector and command-line usage
- **Transport**: StdioServerTransport (JSON-RPC over stdio)
- **Usage**: `npm run inspector`, `npm run start:cli`, `exa-mcp-server`

### 2. Server Function (`dist/index.js`)
- **Purpose**: Programmatic usage and Smithery integration
- **Transport**: Configurable (used by frameworks)
- **Usage**: `npm run dev`, import as module

## Available Tools

### 1. Web Search (`web_search_exa`)
Performs real-time web searches using Exa AI.

**Parameters:**
- `query` (string): Search query
- `numResults` (number, optional): Number of results to return (default: 5)

### 2. Research Paper Search (`research_paper_search_exa`)
Searches for academic papers and research.

**Parameters:**
- `query` (string): Research paper search query
- `numResults` (number, optional): Number of papers to return (default: 5)

### 3. Company Research (`company_research_exa`)
Researches companies and organizations.

**Parameters:**
- `companyName` (string): Name of the company to research
- `numResults` (number, optional): Number of results to return (default: 5)

### 4. Web Crawling (`crawling_exa`)
Extracts content from specific URLs.

**Parameters:**
- `url` (string): URL to crawl and extract content from
- `maxCharacters` (number, optional): Maximum characters to extract (default: 3000)

### 5. Competitor Finder (`competitor_finder_exa`)
Finds business competitors and market analysis.

**Parameters:**
- `companyName` (string): Company to find competitors for
- `industry` (string, optional): Industry sector to narrow search
- `numResults` (number, optional): Number of competitors to find (default: 5)

### 6. LinkedIn Search (`linkedin_search_exa`)
Searches LinkedIn profiles and companies.

**Parameters:**
- `query` (string): LinkedIn search query
- `searchType` (enum, optional): Type of search - "profiles", "companies", or "all" (default: "all")
- `numResults` (number, optional): Number of results to return (default: 5)

### 7. Wikipedia Search (`wikipedia_search_exa`)
Searches Wikipedia articles.

**Parameters:**
- `query` (string): Wikipedia search query
- `numResults` (number, optional): Number of articles to return (default: 5)

### 8. GitHub Search (`github_search_exa`)
Searches GitHub repositories and code.

**Parameters:**
- `query` (string): GitHub search query
- `searchType` (enum, optional): Type of search - "repositories", "code", "users", or "all" (default: "all")
- `numResults` (number, optional): Number of results to return (default: 5)

## Configuration

### Tool Selection

You can configure which tools are enabled by setting the `enabledTools` parameter:

```javascript
{
  "enabledTools": ["web_search_exa", "research_paper_search_exa", "company_research_exa"]
}
```

### Debug Mode

Enable debug logging by setting `debug: true` in configuration or `DEBUG=true` in your `.env` file.

## Development

For detailed development instructions, see [DEVELOPMENT.md](DEVELOPMENT.md).

### Quick Development Setup
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Build and test
npm run build
npm run test:cli

# Run with inspector
npm run inspector
```

## Testing

### CLI Connectivity Test
```bash
# Test CLI startup and MCP connectivity
npm run test:cli
```

### MCP Inspector
```bash
# Run with MCP inspector for interactive testing
npm run inspector
```

### Manual Testing
```bash
# Start CLI manually
npm run start:cli

# In another terminal, test with curl or MCP client
# The CLI uses stdio transport for MCP communication
```

## Migration from v1.x

If you're migrating from version 1.x, see the detailed [MIGRATION.md](MIGRATION.md) guide.

### Breaking Changes in v2.0.0

- **Removed**: `exaApiKey` configuration parameter
- **Removed**: `EXA_API_KEY` environment variable support
- **Added**: Nango authentication system
- **Added**: Required Nango environment variables
- **Added**: TypeScript compilation to `dist/` directory
- **Added**: Separate CLI entry point for MCP inspector
- **Changed**: All tools now use Nango for authentication

## Error Handling

The server provides specific error messages for common authentication issues:

- **Authentication Error**: "Failed to retrieve access token from Nango"
- **Configuration Error**: "Missing required Nango environment variables"
- **Connection Error**: API connection issues with detailed error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test: `npm run build && npm run test:cli`
5. Test with inspector: `npm run inspector`
6. Submit a pull request

### Development Workflow
```bash
# Set up development environment
npm install
npm run build

# Make changes to src/
# ...

# Rebuild and test
npm run build
npm run test:cli
npm run inspector
```

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the [DEVELOPMENT.md](DEVELOPMENT.md) for development setup
- Review the [MIGRATION.md](MIGRATION.md) for upgrade instructions
- Test with MCP inspector: `npm run inspector`
- Check the Nango documentation for authentication setup
- Review the Exa AI documentation for API details

---

**Note**: This server requires proper Nango configuration to function. Make sure to set up your Nango integration and environment variables before using the server. Use `npm run inspector` to test with the MCP inspector.
