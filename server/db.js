const { createClient } = require('@supabase/supabase-js');
const fetch = require('cross-fetch');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Use in-memory database if specified or if Supabase credentials are missing
if (process.env.USE_MEMORY_DB === 'true' || !supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Using in-memory database (data will not persist)');
  module.exports = require('./db-memory');
} else {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      fetch: fetch,
    },
  });
  module.exports = supabase;
}
