#!/usr/bin/env node

/**
 * Debug script to test Nango authentication with actual response structure
 */

import { config } from "dotenv";
import { get_connection_credentials, get_access_token } from "../dist/auth/nango.js";

// Load environment variables
config();

console.log('🔍 Testing Nango Authentication...');
console.log('');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`   NANGO_BASE_URL: ${process.env.NANGO_BASE_URL || 'NOT SET'}`);
console.log(`   NANGO_CONNECTION_ID: ${process.env.NANGO_CONNECTION_ID || 'NOT SET'}`);
console.log(`   NANGO_INTEGRATION_ID: ${process.env.NANGO_INTEGRATION_ID || 'NOT SET'}`);
console.log(`   NANGO_SECRET_KEY: ${process.env.NANGO_SECRET_KEY ? process.env.NANGO_SECRET_KEY.substring(0, 8) + '...' : 'NOT SET'}`);
console.log('');

// Test connection credentials
console.log('🔗 Testing connection credentials...');
try {
  const credentials = await get_connection_credentials();
  console.log('✅ Successfully retrieved connection credentials');
  console.log('');
  console.log('📋 Connection Details:');
  console.log(`   ID: ${credentials.id}`);
  console.log(`   Connection ID: ${credentials.connection_id}`);
  console.log(`   Provider: ${credentials.provider}`);
  console.log(`   Provider Config Key: ${credentials.provider_config_key}`);
  console.log(`   Created: ${credentials.created_at}`);
  console.log(`   Last Fetched: ${credentials.last_fetched_at}`);
  console.log('');
  
  console.log('👤 End User Info:');
  console.log(`   ID: ${credentials.end_user.id}`);
  console.log(`   Display Name: ${credentials.end_user.display_name}`);
  console.log(`   Email: ${credentials.end_user.email}`);
  console.log('');
  
  console.log('🔑 Credentials Info:');
  console.log(`   Type: ${credentials.credentials?.type}`);
  console.log(`   Has API Key: ${credentials.credentials?.apiKey ? 'Yes' : 'No'}`);
  console.log(`   Has Access Token: ${credentials.credentials?.access_token ? 'Yes' : 'No'}`);
  
  if (credentials.credentials?.apiKey) {
    console.log(`   API Key Preview: ${credentials.credentials.apiKey.substring(0, 12)}...`);
  }
  
  if (credentials.errors && credentials.errors.length > 0) {
    console.log('');
    console.log('⚠️  Connection Errors:');
    credentials.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${JSON.stringify(error)}`);
    });
  }
  
  console.log('');
  
  // Test access token extraction
  console.log('🔑 Testing access token extraction...');
  const accessToken = await get_access_token();
  console.log('✅ Successfully retrieved access token');
  console.log(`   Token Preview: ${accessToken.substring(0, 12)}...`);
  console.log(`   Token Length: ${accessToken.length} characters`);
  console.log('');
  
  console.log('🎉 Nango authentication is working correctly!');
  console.log('');
  console.log('🚀 You can now run:');
  console.log('   npm run inspector');
  console.log('   npm run start:cli');
  
} catch (error) {
  console.error('❌ Nango authentication failed');
  console.error('');
  console.error('🔍 Error details:');
  console.error(`   Message: ${error.message}`);
  console.error(`   Type: ${error.name}`);
  
  if (error.response) {
    console.error(`   HTTP Status: ${error.response.status}`);
    console.error(`   HTTP Status Text: ${error.response.statusText}`);
    console.error('');
    console.error('📋 Response Data:');
    console.error(JSON.stringify(error.response.data, null, 2));
  }
  
  console.error('');
  console.error('🛠️  Troubleshooting steps:');
  console.error('   1. Check your Nango dashboard for the connection status');
  console.error('   2. Verify that the integration is active');
  console.error('   3. Ensure the connection ID and integration ID are correct');
  console.error('   4. Check that your secret key has the right permissions');
  console.error('   5. Verify that your Exa API credentials are set up in Nango');
  console.error('   6. Check if the connection needs to be refreshed');
  
  process.exit(1);
}
