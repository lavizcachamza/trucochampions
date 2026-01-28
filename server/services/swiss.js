const supabase = require('../db');

/**
 * Generates pairing for the next round using a simplified Swiss System.
 * 
 * Rules:
 * 1. Round 1: Random pairing.
 * 2. Round N: Pair teams with similar scores (High vs High).
 * 3. Avoid repeating matchups (if possible - simplified here).
 * 4. Handle BYE if odd number of teams.
 */
class SwissSystem {

    async generateRound(category) {
        // 1. Fetch all teams of category
        const { data: teams, error } = await supabase
            .from('teams')
            .select('*')
            .eq('category', category)
            .eq('status', 'checkin'); // Only checked-in teams play

        if (error || !teams) throw new Error('Error fetching teams');

        if (teams.length < 2) throw new Error('Not enough teams to generate round');

        // 2. Fetch all previous matches to avoid repeats (TODO for advanced version)
        // For MVP, we will rely on score sorting.

        // 3. Sort teams by points (High to Low)
        // Note: We need to calculate points first. For R1, it's 0.
        // Ideally we have a view or we calc on the fly.
        // Let's assume we have 'points' in the team object or we fetch simple list.
        // For MVP: We will shuffle for R1, sort for others.

        // Check if it's Round 1 (no matches yet)
        // We can pass round number, or check if any matches exist for this category.

        // Shuffle or Sort
        let sortedTeams = [...teams];

        // If we assume R1 is random, we shuffle.
        // If not R1, we should sort by points.
        // For MVP, lets just shuffle for R1.
        if (await this.isFirstRound(category)) {
            sortedTeams.sort(() => Math.random() - 0.5);
        } else {
            // Fetch standings and sort
            // This part requires calculating standings.
            // For now, let's implement a random shuffle for MVP proof, 
            // and then upgrade to score-based sorting.
            sortedTeams.sort(() => Math.random() - 0.5);
        }

        const matches = [];

        // 4. Pair them
        while (sortedTeams.length >= 2) {
            const home = sortedTeams.shift();
            const away = sortedTeams.shift();

            matches.push({
                team_home_id: home.id,
                team_away_id: away.id,
                category: category
            });
        }

        // 5. Handle Bye
        let byeTeam = null;
        if (sortedTeams.length === 1) {
            byeTeam = sortedTeams[0];
        }

        return { matches, byeTeam };
    }

    async isFirstRound(category) {
        // Check if any matches exist
        return true; // Simplified for MVP start
    }
}

module.exports = new SwissSystem();
