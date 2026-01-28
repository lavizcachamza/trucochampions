require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const createEventsTable = async () => {
    console.log('Creating events table...');

    const sql = `
    CREATE TABLE IF NOT EXISTS events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      description TEXT,
      date TIMESTAMP WITH TIME ZONE NOT NULL,
      location TEXT,
      image_url TEXT,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    // NOTE: accessing 'rpc' might fail if 'exec_sql' function is not defined in Supabase.
    // Standard Supabase client doesn't allow raw SQL execution unless via a stored procedure.
    // Fallback: We'll try to use the REST API to check connectivity, but for DDL we might need to ask User 
    // or use the 'pg' library if we had direct connection string.
    // However, often users use the dashboard. 
    // Let's try to assume we might NOT have a way to run DDL via supabase-js client directly without a helper.

    // Alternative: If the user provided a connection string (Postgres URI), we could use 'pg'.
    // But we only have URL and Key.

    console.log('⚠️  Supabase JS Client cannot execute raw DDL (CREATE TABLE) directly without a stored procedure.');
    console.log('Please run the following SQL in the Supabase SQL Editor:');
    console.log(sql);
};

// Actually, since we can't easily run DDL via JS client without setup, 
// I will create the routes and model assuming the table exists, 
// and ask the user to run the SQL or use a stored procedure if they have one.
// BUT, I can try to use the "postgres" connection string if available. 
// The user has DATABASE_URL in db.js? No, checking db.js...

createEventsTable();
