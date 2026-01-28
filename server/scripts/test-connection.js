const supabase = require('../db');

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('teams').select('*').limit(1);

        if (error) {
            console.error('❌ Connection failed:', error.message);
            console.error('Details:', error);
        } else {
            console.log('✅ Connection successful!');
            console.log('Query result:', data);
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

testConnection();
