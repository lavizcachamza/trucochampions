const axios = require('axios');
const supabase = require('../db');

const API_URL = 'http://localhost:3001/api';

async function verify() {
    console.log('🧪 Starting End-to-End Verification...');

    try {
        // 1. Generate Fixture
        console.log('\n1. Generating Fixture for "Pareja"...');
        const genRes = await axios.post(`${API_URL}/rounds/generate`, { category: 'Pareja' });
        if (genRes.data.success) {
            console.log('✅ Fixture Generated. Matches:', genRes.data.matches.length);
        } else {
            throw new Error('Fixture generation failed');
        }

        // 2. Fetch Live Matches
        console.log('\n2. Fetching Live Matches...');
        const liveRes = await axios.get(`${API_URL}/matches/live`);
        const matches = liveRes.data;
        console.log(`✅ Found ${matches.length} live matches.`);

        if (matches.length === 0) throw new Error('No matches found');

        const matchToTest = matches[0];
        console.log(`   Testing Match: ${matchToTest.id} - ${matchToTest.team_home.name} vs ${matchToTest.team_away.name}`);

        // 3. Update Score (Referee Action)
        console.log('\n3. Updating Score (Referee Action)...');
        const updateRes = await axios.put(`${API_URL}/matches/${matchToTest.id}/score`, {
            score_home: 15,
            score_away: 10,
            status: 'live'
        });

        if (updateRes.data.success && updateRes.data.match.score_home === 15) {
            console.log('✅ Score Updated Successfully!');
        } else {
            throw new Error('Score update failed');
        }

        console.log('\n🎉 ALL CHECKS PASSED!');

    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    }
}

verify();
