#!/bin/bash

echo "🚀 Starting CareConnect Server..."

# Test basic Node.js functionality
node -e "
console.log('✅ Node.js version:', process.version);
console.log('✅ Environment check:');
console.log('- PORT:', process.env.PORT || 'Not set');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
console.log('✅ Basic tests passed');
"

# Start the server
exec npm start
