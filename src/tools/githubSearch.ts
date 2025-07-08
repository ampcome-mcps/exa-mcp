import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { API_CONFIG } from "./config.js";
import { ExaSearchRequest, ExaSearchResponse } from "../types.js";
import { createRequestLogger } from "../utils/logger.js";
import { createAuthenticatedAxiosInstance } from "../auth/nango.js";

export function registerGithubSearchTool(server: McpServer, config?: { debug?: boolean }): void {
  server.tool(
    "github_search_exa",
    "Search GitHub repositories and code using Exa AI - finds repositories, code snippets, documentation, and developer profiles on GitHub. Useful for finding open source projects, code examples, and technical resources. Uses Nango for authentication.",
    {
      query: z.string().describe("GitHub search query (repository name, programming language, username, etc.)"),
      searchType: z.enum(["repositories", "code", "users", "all"]).optional().describe("Type of GitHub content to search (default: all)"),
      numResults: z.number().optional().describe("Number of GitHub results to return (default: 5)")
    },
    async ({ query, searchType, numResults }) => {
      const requestId = `github_search_exa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const logger = createRequestLogger(requestId, 'github_search_exa');
      
      logger.start(`${query} (${searchType || 'all'})`);
      
      try {
        // Create authenticated axios instance using Nango
        logger.log("Creating authenticated axios instance via Nango");
        const axiosInstance = await createAuthenticatedAxiosInstance(API_CONFIG.BASE_URL);

        let searchQuery = query;
        if (searchType === "repositories") {
          searchQuery = `${query} GitHub repository`;
        } else if (searchType === "code") {
          searchQuery = `${query} GitHub code`;
        } else if (searchType === "users") {
          searchQuery = `${query} GitHub user profile`;
        } else {
          searchQuery = `${query} GitHub`;
        }

        const searchRequest: ExaSearchRequest = {
          query: searchQuery,
          type: "neural",
          numResults: numResults || API_CONFIG.DEFAULT_NUM_RESULTS,
          contents: {
            text: {
              maxCharacters: API_CONFIG.DEFAULT_MAX_CHARACTERS
            },
            livecrawl: 'preferred'
          },
          includeDomains: ["github.com"]
        };
        
        logger.log("Sending request to Exa API for GitHub search");
        
        const response = await axiosInstance.post<ExaSearchResponse>(
          API_CONFIG.ENDPOINTS.SEARCH,
          searchRequest,
          { timeout: 25000 }
        );
        
        logger.log("Received response from Exa API");

        if (!response.data || !response.data.results) {
          logger.log("Warning: Empty or invalid response from Exa API");
          return {
            content: [{
              type: "text" as const,
              text: "No GitHub content found. Please try a different query."
            }]
          };
        }

        logger.log(`Found ${response.data.results.length} GitHub results`);
        
        const result = {
          content: [{
            type: "text" as const,
            text: JSON.stringify(response.data, null, 2)
          }]
        };
        
        logger.complete();
        return result;
      } catch (error) {
        logger.error(error);
        
        // Handle authentication errors specifically
        if (error instanceof Error && error.message.includes("Access token not found")) {
          logger.log("Authentication error: Failed to retrieve access token from Nango");
          return {
            content: [{
              type: "text" as const,
              text: "Authentication error: Failed to retrieve access token from Nango. Please check your Nango configuration."
            }],
            isError: true,
          };
        }
        
        // Handle other specific errors
        if (error instanceof Error && error.message.includes("Missing required Nango environment variables")) {
          logger.log("Configuration error: Missing Nango environment variables");
          return {
            content: [{
              type: "text" as const,
              text: "Configuration error: Missing required Nango environment variables. Please check your .env file."
            }],
            isError: true,
          };
        }
        
        // Handle generic errors
        return {
          content: [{
            type: "text" as const,
            text: `GitHub search error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true,
        };
      }
    }
  );
}