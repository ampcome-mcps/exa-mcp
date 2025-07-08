import axios, { AxiosInstance } from "axios";
import { log } from "../utils/logger.js";

/**
 * Nango authentication service for EXA MCP Server
 * Handles authentication using Nango's connection management
 */

export interface NangoCredentials {
  type: string;
  apiKey: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  [key: string]: any;
}

export interface NangoConnection {
  id: number;
  connection_id: string;
  provider_config_key: string;
  provider: string;
  errors: any[];
  end_user: {
    id: string;
    display_name: string;
    email: string;
    organization: string | null;
  };
  metadata: any;
  connection_config: any;
  created_at: string;
  updated_at: string;
  last_fetched_at: string;
  credentials: NangoCredentials;
  [key: string]: any;
}

/**
 * Get credentials from Nango
 * @returns Connection credentials from Nango
 */
export function get_connection_credentials(): Promise<NangoConnection> {
  const connection_id = process.env.NANGO_CONNECTION_ID;
  const integration_id = process.env.NANGO_INTEGRATION_ID;
  const base_url = process.env.NANGO_BASE_URL;
  const secret_key = process.env.NANGO_SECRET_KEY;

  if (!connection_id || !integration_id || !base_url || !secret_key) {
    throw new Error("Missing required Nango environment variables: NANGO_CONNECTION_ID, NANGO_INTEGRATION_ID, NANGO_BASE_URL, NANGO_SECRET_KEY");
  }

  const url = `${base_url}/connection/${connection_id}`;
  const params = {
    provider_config_key: integration_id,
    refresh_token: "true",
  };
  
  const headers = {
    "Authorization": `Bearer ${secret_key}`,
    "Content-Type": "application/json",
  };

  log(`Fetching credentials from Nango: ${url}`);

  return axios.get(url, { headers, params })
    .then(response => {
      log("Successfully retrieved credentials from Nango");
      return response.data;
    })
    .catch(error => {
      log(`Failed to retrieve credentials from Nango: ${error.message}`);
      throw error;
    });
}

/**
 * Get access token from Nango credentials
 * @returns Access token for API calls
 */
export async function get_access_token(): Promise<string> {
  try {
    const credentials = await get_connection_credentials();
    
    // Try different possible locations for the API key
    let access_token = null;
    
    // Check for apiKey (your Nango structure)
    if (credentials.credentials?.apiKey) {
      access_token = credentials.credentials.apiKey;
      log("Found API key in credentials.apiKey");
    }
    // Fallback to access_token (standard OAuth)
    else if (credentials.credentials?.access_token) {
      access_token = credentials.credentials.access_token;
      log("Found access token in credentials.access_token");
    }
    
    if (!access_token) {
      const availableFields = Object.keys(credentials.credentials || {});
      log(`Available credential fields: ${availableFields.join(", ")}`);
      throw new Error("Access token not found in credentials. Available fields: " + availableFields.join(", "));
    }
    
    log("Successfully retrieved access token from Nango");
    return access_token;
  } catch (error) {
    log(`Failed to get access token: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Create authenticated axios instance with Nango credentials
 * @returns Configured axios instance
 */
export async function createAuthenticatedAxiosInstance(baseURL: string): Promise<AxiosInstance> {
  const access_token = await get_access_token();
  
  return axios.create({
    baseURL,
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-api-key': access_token
    },
    timeout: 25000
  });
}
