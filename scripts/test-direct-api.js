#!/usr/bin/env node

/**
 * Test script with direct API key (for troubleshooting)
 */

import axios from 'axios';
import { config } from "dotenv";

config();

console.log('🔍 Testing direct Exa API connection...');

// You can temporarily set this for testing
const DIRECT_EXA_API_KEY = process.env.DIRECT_EXA_API_KEY || 'your-exa-api-key-here';

if (!DIRECT_EXA_API_KEY || DIRECT_EXA_API_KEY === 'your-exa-api-key-here') {
  console.log('⚠️  To test with direct API key, set DIRECT_EXA_API_KEY in your .env file');
  console.log('   This is only for troubleshooting - use Nango in production');
  process.exit(0);
}

try {
  const response = await axios.post('https://api.exa.ai/search', {
    query: 'test search',
    numResults: 1,
    type: 'auto'
  }, {
    headers: {
      'x-api-key': DIRECT_EXA_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  console.log('✅ Direct Exa API connection successful');
  console.log('📋 Response:', response.data);
  console.log('');
  console.log('🔧 This confirms your Exa API key works.');
  console.log('   The issue is with the Nango configuration.');
  
} catch (error) {
  console.error('❌ Direct Exa API connection failed');
  console.error('Error:', error.response?.data || error.message);
  
  if (error.response?.status === 401) {
    console.error('🔑 API key is invalid or expired');
  } else if (error.response?.status === 403) {
    console.error('🚫 API key doesn\'t have permission');
  } else {
    console.error('🌐 Network or other error');
  }
}
