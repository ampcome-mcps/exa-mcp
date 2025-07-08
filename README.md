# Exa MCP Server

A Model Context Protocol server that integrates Exa AI's search capabilities with Claude and other MCP clients. Provides 8 powerful search tools with secure Nango authentication.

## Features

- 🔍 **Web Search** - Real-time web search with Exa AI
- 📚 **Research Papers** - Academic and scholarly content search
- 🏢 **Company Research** - Business intelligence and company data
- 🌐 **Web Crawling** - Extract content from specific URLs
- 🔍 **Competitor Analysis** - Find and analyze business competitors
- 💼 **LinkedIn Search** - Professional profiles and company pages
- 📖 **Wikipedia Search** - Comprehensive encyclopedia search
- 💻 **GitHub Search** - Code repositories and developer profiles
- 🔐 **Secure Authentication** - Nango-based credential management
- 🔧 **MCP Inspector Support** - Easy testing and development

## Quick Start

```bash
# Install
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Nango credentials

# Run with MCP Inspector
npm run inspector
```

## Installation

### From NPM
```bash
npm install -g exa-mcp-server
exa-mcp-server
```

### From Source
```bash
git clone <repository-url>
cd exa-mcp-server
npm install
npm run inspector
```

## Configuration

### Environment Variables

Create a `.env` file with your Nango credentials:

```bash
# Required Nango Configuration
NANGO_CONNECTION_ID=your_connection_id
NANGO_INTEGRATION_ID=your_integration_id
NANGO_BASE_URL=https://api.nango.dev
NANGO_SECRET_KEY=your_secret_key

# Optional
DEBUG=true
```

### Nango Setup

1. Create a Nango account at [nango.dev](https://nango.dev)
2. Set up an integration for Exa API
3. Configure your connection with Exa API credentials
4. Update `.env` with your Nango credentials

## Usage

### MCP Inspector (Development)
```bash
npm run inspector
```

### CLI Mode
```bash
npm run start:cli
```

### Global Command
```bash
exa-mcp-server
```

### Development
```bash
npm run dev        # Development mode
npm run watch      # Watch TypeScript
npm test          # Run tests
```

## Available Tools

### 1. Web Search (`web_search_exa`)
Real-time web search with configurable results.

**Parameters:**
- `query` (string): Search query
- `numResults` (number, optional): Results count (default: 5)

### 2. Research Papers (`research_paper_search_exa`)
Academic and scholarly content search.

**Parameters:**
- `query` (string): Research query
- `numResults` (number, optional): Results count (default: 5)

### 3. Company Research (`company_research_exa`)
Business intelligence and company data.

**Parameters:**
- `companyName` (string): Company name
- `numResults` (number, optional): Results count (default: 5)

### 4. Web Crawling (`crawling_exa`)
Extract content from specific URLs.

**Parameters:**
- `url` (string): URL to crawl
- `maxCharacters` (number, optional): Max content length (default: 3000)

### 5. Competitor Finder (`competitor_finder_exa`)
Find and analyze business competitors.

**Parameters:**
- `companyName` (string): Company name
- `industry` (string, optional): Industry filter
- `numResults` (number, optional): Results count (default: 5)

### 6. LinkedIn Search (`linkedin_search_exa`)
Professional profiles and company pages.

**Parameters:**
- `query` (string): Search query
- `searchType` (enum, optional): "profiles", "companies", "all" (default: "all")
- `numResults` (number, optional): Results count (default: 5)

### 7. Wikipedia Search (`wikipedia_search_exa`)
Comprehensive encyclopedia search.

**Parameters:**
- `query` (string): Search query
- `numResults` (number, optional): Results count (default: 5)

### 8. GitHub Search (`github_search_exa`)
Code repositories and developer profiles.

**Parameters:**
- `query` (string): Search query
- `searchType` (enum, optional): "repositories", "code", "users", "all" (default: "all")
- `numResults` (number, optional): Results count (default: 5)

## Development

### Build
```bash
npm run build      # Full build
npm run build:ts   # TypeScript only
npm run clean      # Clean build files
```

### Testing
```bash
npm run test:nango    # Test Nango auth
npm run test:exa      # Test Exa API
npm run test:cli      # Test CLI connectivity
npm test             # Run all tests
```

### Project Structure
```
exa-mcp-server/
├── src/
│   ├── auth/nango.ts        # Nango authentication
│   ├── tools/               # Search tool implementations
│   ├── utils/logger.ts      # Logging utilities
│   ├── index.ts            # Main server function
│   ├── cli.ts              # CLI entry point
│   └── types.ts            # Type definitions
├── dist/                   # Compiled output
├── scripts/                # Build and test scripts
├── .env.example           # Environment template
└── package.json
```

## Troubleshooting

### Authentication Issues
```bash
# Test Nango connection
npm run test:nango

# Check environment variables
echo $NANGO_CONNECTION_ID
```

### Build Issues
```bash
# Clean rebuild
npm run clean
npm run build

# Check TypeScript
npx tsc --noEmit
```

### Runtime Issues
```bash
# Validate build
npm run validate

# Debug mode
DEBUG=true npm run start:cli
```

## Updates

### Update All Dependencies
```bash
npm run update
```

### Manual Update
```bash
npm install -g npm@latest
rm -rf node_modules package-lock.json
npm install
```

## License

MIT License - see LICENSE file for details.

## Support

- Create GitHub issues for bugs
- Check MCP Inspector: `npm run inspector`
- Test authentication: `npm run test:nango`
- Review [Nango documentation](https://docs.nango.dev) for auth setup
- Check [Exa API documentation](https://docs.exa.ai) for API details

---

**Note**: Requires Nango configuration. See `.env.example` for setup instructions.
