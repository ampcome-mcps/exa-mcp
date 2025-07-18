import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { API_CONFIG } from "./config.js";
import { ExaSearchRequest, ExaSearchResponse } from "../types.js";
import { createRequestLogger } from "../utils/logger.js";
import { createAuthenticatedAxiosInstance } from "../auth/nango.js";

export function registerCompanyResearchTool(server: McpServer, config?: { debug?: boolean }): void {
  server.tool(
    "company_research_exa",
    "Research companies using Exa AI - finds comprehensive information about businesses, organizations, and corporations. Provides insights into company operations, news, financial information, and industry analysis. Uses Nango for authentication.",
    {
      companyName: z.string().describe("Name of the company to research"),
      numResults: z.number().optional().describe("Number of search results to return (default: 5)")
    },
    async ({ companyName, numResults }) => {
      const requestId = `company_research_exa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const logger = createRequestLogger(requestId, 'company_research_exa');
      
      logger.start(companyName);
      
      try {
        // Create authenticated axios instance using Nango
        logger.log("Creating authenticated axios instance via Nango");
        const axiosInstance = await createAuthenticatedAxiosInstance(API_CONFIG.BASE_URL);

        const searchRequest: ExaSearchRequest = {
          query: `${companyName} company business corporation information news financial`,
          type: "neural",
          numResults: numResults || API_CONFIG.DEFAULT_NUM_RESULTS,
          contents: {
            text: {
              maxCharacters: API_CONFIG.DEFAULT_MAX_CHARACTERS
            },
            livecrawl: 'preferred'
          },
          includeDomains: ["bloomberg.com", "reuters.com", "crunchbase.com", "sec.gov", "linkedin.com", "forbes.com", "businesswire.com", "prnewswire.com"]
        };
        
        logger.log("Sending request to Exa API for company research");
        
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
              text: "No company information found. Please try a different company name."
            }]
          };
        }

        logger.log(`Found ${response.data.results.length} company research results`);
        
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
            text: `Company research error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true,
        };
      }
    }
  );
}