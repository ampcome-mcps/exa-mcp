#!/usr/bin/env node

/**
 * CLI entry point for exa-mcp-server
 * This file provides a proper MCP transport layer for the inspector and other MCP clients
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { config } from "dotenv";

// Load environment variables
config();

// Import the main server function
import serverFunction, { configSchema } from "./index.js";

async function main() {
  // Parse configuration (you can extend this to accept command line args)
  const serverConfig = {
    enabledTools: undefined, // Enable all tools by default
    debug: process.env.DEBUG === 'true' || false
  };

  // Validate configuration
  const validatedConfig = configSchema.parse(serverConfig);

  // Get the server instance
  const server = serverFunction({ config: validatedConfig });

  // Create stdio transport
  const transport = new StdioServerTransport();
  
  // Connect server to transport
  await server.connect(transport);

  // Handle process termination
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

// Run the server
main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
