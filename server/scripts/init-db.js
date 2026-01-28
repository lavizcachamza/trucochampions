const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, '../schema.sql');

async function initDb() {
    console.log('\n🔵 SWITCHED TO SUPABASE API CLIENT 🔵');
    console.log('Since we are using the API Client, we cannot run "CREATE TABLE" commands directly from here without a direct SQL connection.');

    console.log('\n👉 ACTION REQUIRED:');
    console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Open the "SQL Editor" from the left sidebar.');
    console.log('3. Copy the content of "server/schema.sql".');
    console.log('4. Paste it into the SQL Editor and click "RUN".');

    console.log('\n📄 Content of schema.sql has been printed below for your convenience:\n');

    try {
        const sql = fs.readFileSync(schemaPath, 'utf8');
        console.log('---------------------------------------------------');
        console.log(sql);
        console.log('---------------------------------------------------');
    } catch (err) {
        console.error('❌ Could not read schema.sql', err);
    }
}

initDb();
