#!/usr/bin/env node

/**
 * Test script to verify Exa API connectivity with Nango-retrieved credentials
 */

import { config } from "dotenv";
import { get_access_token, createAuthenticatedAxiosInstance } from "../dist/auth/nango.js";

// Load environment variables
config();

console.log('🔍 Testing Exa API with Nango credentials...');
console.log('');

try {
  // Get access token from Nango
  console.log('🔑 Retrieving access token from Nango...');
  const accessToken = await get_access_token();
  console.log('✅ Successfully retrieved access token');
  console.log(`   Token Preview: ${accessToken.substring(0, 12)}...`);
  console.log('');
  
  // Create authenticated axios instance
  console.log('🔧 Creating authenticated axios instance...');
  const axiosInstance = await createAuthenticatedAxiosInstance('https://api.exa.ai');
  console.log('✅ Successfully created authenticated axios instance');
  console.log('');
  
  // Test with a simple search
  console.log('🔍 Testing Exa API search...');
  const searchRequest = {
    query: 'test search',
    type: 'auto',
    numResults: 1,
    contents: {
      text: {
        maxCharacters: 100
      }
    }
  };
  
  const response = await axiosInstance.post('/search', searchRequest);
  
  console.log('✅ Exa API search successful!');
  console.log('');
  console.log('📋 Response Summary:');
  console.log(`   Request ID: ${response.data.requestId}`);
  console.log(`   Search Type: ${response.data.resolvedSearchType}`);
  console.log(`   Results Count: ${response.data.results?.length || 0}`);
  
  if (response.data.results && response.data.results.length > 0) {
    const firstResult = response.data.results[0];
    console.log('');
    console.log('📄 First Result:');
    console.log(`   Title: ${firstResult.title}`);
    console.log(`   URL: ${firstResult.url}`);
    console.log(`   Published: ${firstResult.publishedDate}`);
    console.log(`   Text Preview: ${firstResult.text?.substring(0, 100) || 'No text'}...`);
  }
  
  console.log('');
  console.log('🎉 Everything is working correctly!');
  console.log('');
  console.log('🚀 You can now run:');
  console.log('   npm run inspector');
  console.log('   npm run start:cli');
  
} catch (error) {
  console.error('❌ Exa API test failed');
  console.error('');
  console.error('🔍 Error details:');
  console.error(`   Message: ${error.message}`);
  
  if (error.response) {
    console.error(`   HTTP Status: ${error.response.status}`);
    console.error(`   HTTP Status Text: ${error.response.statusText}`);
    console.error('');
    console.error('📋 Response Data:');
    console.error(JSON.stringify(error.response.data, null, 2));
    
    if (error.response.status === 401) {
      console.error('');
      console.error('🔑 Authentication Issue:');
      console.error('   The API key retrieved from Nango is invalid or expired');
      console.error('   Check your Exa API key in the Nango dashboard');
    } else if (error.response.status === 403) {
      console.error('');
      console.error('🚫 Permission Issue:');
      console.error('   The API key doesn\'t have permission for this operation');
    } else if (error.response.status === 429) {
      console.error('');
      console.error('⏰ Rate Limit Issue:');
      console.error('   Too many requests. Wait and try again.');
    }
  }
  
  console.error('');
  console.error('🛠️  Troubleshooting steps:');
  console.error('   1. Verify your Exa API key in the Nango dashboard');
  console.error('   2. Check if the API key has the correct permissions');
  console.error('   3. Ensure the API key is not expired');
  console.error('   4. Try refreshing the Nango connection');
  
  process.exit(1);
}
