import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { API_CONFIG } from "./config.js";
import { ExaSearchRequest, ExaSearchResponse } from "../types.js";
import { createRequestLogger } from "../utils/logger.js";
import { createAuthenticatedAxiosInstance } from "../auth/nango.js";

export function registerCompetitorFinderTool(server: McpServer, config?: { debug?: boolean }): void {
  server.tool(
    "competitor_finder_exa",
    "Find competitors for a business using Exa AI - identifies similar companies, competitive landscape analysis, and market positioning. Helps discover direct and indirect competitors in any industry. Uses Nango for authentication.",
    {
      companyName: z.string().describe("Name of the company to find competitors for"),
      industry: z.string().optional().describe("Industry sector (optional, helps narrow search)"),
      numResults: z.number().optional().describe("Number of competitors to find (default: 5)")
    },
    async ({ companyName, industry, numResults }) => {
      const requestId = `competitor_finder_exa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const logger = createRequestLogger(requestId, 'competitor_finder_exa');
      
      logger.start(`${companyName} ${industry ? `in ${industry}` : ''}`);
      
      try {
        // Create authenticated axios instance using Nango
        logger.log("Creating authenticated axios instance via Nango");
        const axiosInstance = await createAuthenticatedAxiosInstance(API_CONFIG.BASE_URL);

        const searchQuery = industry 
          ? `${companyName} competitors similar companies ${industry} industry competitive landscape`
          : `${companyName} competitors similar companies competitive landscape market`;

        const searchRequest: ExaSearchRequest = {
          query: searchQuery,
          type: "neural",
          numResults: numResults || API_CONFIG.DEFAULT_NUM_RESULTS,
          contents: {
            text: {
              maxCharacters: API_CONFIG.DEFAULT_MAX_CHARACTERS
            },
            livecrawl: 'preferred'
          }
        };
        
        logger.log("Sending request to Exa API for competitor analysis");
        
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
              text: "No competitor information found. Please try a different company name or industry."
            }]
          };
        }

        logger.log(`Found ${response.data.results.length} competitor analysis results`);
        
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
            text: `Competitor finder error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true,
        };
      }
    }
  );
}