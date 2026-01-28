import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Plus, Minus, Save, Clock } from 'lucide-react';
import { API_URL } from '../config';

const socket = io(API_URL);

const Referee = () => {
    // For MVP, if we dont access via ID, we might just list all live matches to pick one.
    // Let's assume this component is used with a selector or ID param.
    // For simplicity, let's make it a list selector first, then score view.

    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMatches();

        // Listen for updates from other sources (e.g. other referee or admin)
        socket.on('match_update', (updatedMatch) => {
            if (selectedMatch && selectedMatch.id === updatedMatch.id) {
                setSelectedMatch(updatedMatch);
            }
            setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
        });

        return () => socket.off('match_update');
    }, [selectedMatch]);

    const fetchMatches = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/matches/live`);
            setMatches(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateScore = async (team, delta) => {
        if (!selectedMatch) return;

        const newScore = {
            score_home: selectedMatch.score_home,
            score_away: selectedMatch.score_away
        };

        if (team === 'home') newScore.score_home = Math.max(0, newScore.score_home + delta);
        if (team === 'away') newScore.score_away = Math.max(0, newScore.score_away + delta);

        // Optimistic update
        setSelectedMatch({ ...selectedMatch, ...newScore });

        try {
            await axios.put(`${API_URL}/api/matches/${selectedMatch.id}/score`, {
                ...newScore,
                status: 'live' // Ensure it's live
            });
        } catch (err) {
            console.error('Failed to sync score', err);
            // Revert on error? For MVP we just alert or re-fetch.
        }
    };

    const finishMatch = async () => {
        if (!window.confirm(`¿Finalizar partido?\n${selectedMatch.team_home.name}: ${selectedMatch.score_home}\n${selectedMatch.team_away.name}: ${selectedMatch.score_away}`)) return;

        try {
            await axios.put(`${API_URL}/api/matches/${selectedMatch.id}/score`, {
                score_home: selectedMatch.score_home,
                score_away: selectedMatch.score_away,
                status: 'finished'
            });
            setSelectedMatch(null);
            fetchMatches();
        } catch (err) {
            alert('Error al finalizar');
        }
    };

    if (!selectedMatch) {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-4">
                <h1 className="text-xl font-bold mb-6 text-center text-accent">Panel de Árbitro</h1>
                <p className="text-slate-400 mb-4 text-center">Selecciona un partido para arbitrar</p>

                <div className="space-y-4">
                    {matches.map(m => (
                        <div
                            key={m.id}
                            onClick={() => setSelectedMatch(m)}
                            className="bg-slate-800 p-4 rounded-xl border border-slate-700 active:scale-95 transition cursor-pointer"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold bg-blue-900 text-blue-300 px-2 py-1 rounded">Mesa {m.table_number || '?'}</span>
                                <span className="text-xs text-slate-400">{m.category}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>{m.team_home?.name}</span>
                                <span className="text-slate-500">vs</span>
                                <span>{m.team_away?.name}</span>
                            </div>
                        </div>
                    ))}
                    {matches.length === 0 && <p className="text-center text-slate-500">No hay partidos activos.</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            {/* Header */}
            <div className="p-4 bg-slate-800 flex justify-between items-center shadow-lg z-10">
                <button onClick={() => setSelectedMatch(null)} className="text-slate-400 text-sm">← Volver</button>
                <span className="font-bold text-accent">Mesa {selectedMatch.table_number || 1}</span>
                <div className="w-10"></div>
            </div>

            {/* Score Area */}
            <div className="flex-1 flex flex-col justify-center gap-2 p-2">

                {/* Home Team */}
                <div className="bg-blue-600 rounded-2xl p-6 flex flex-col items-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-white/20"></div>
                    <h2 className="text-xl font-bold mb-2 text-center leading-tight">{selectedMatch.team_home?.name}</h2>
                    <div className="text-7xl font-black my-4 font-mono">{selectedMatch.score_home}</div>

                    <div className="flex gap-4 w-full justify-center">
                        <button
                            onClick={() => updateScore('home', -1)}
                            className="w-16 h-16 rounded-full bg-blue-800/50 flex items-center justify-center border-2 border-blue-400 active:bg-blue-800 transition"
                        >
                            <Minus size={32} />
                        </button>
                        <button
                            onClick={() => updateScore('home', 1)}
                            className="w-24 h-16 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-bold shadow-lg active:scale-95 transition"
                        >
                            <Plus size={40} />
                        </button>
                    </div>
                </div>

                {/* Away Team */}
                <div className="bg-slate-700 rounded-2xl p-6 flex flex-col items-center shadow-lg relative overflow-hidden mt-2">
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-400/50"></div>
                    <h2 className="text-xl font-bold mb-2 text-center leading-tight">{selectedMatch.team_away?.name}</h2>
                    <div className="text-7xl font-black my-4 font-mono">{selectedMatch.score_away}</div>

                    <div className="flex gap-4 w-full justify-center">
                        <button
                            onClick={() => updateScore('away', -1)}
                            className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center border-2 border-slate-500 active:bg-slate-800 transition"
                        >
                            <Minus size={32} />
                        </button>
                        <button
                            onClick={() => updateScore('away', 1)}
                            className="w-24 h-16 rounded-2xl bg-white text-slate-800 flex items-center justify-center font-bold shadow-lg active:scale-95 transition"
                        >
                            <Plus size={40} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-800">
                <button
                    onClick={finishMatch}
                    className="w-full py-4 bg-green-600 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
                >
                    <Save size={24} />
                    FINALIZAR PARTIDO
                </button>
            </div>
        </div>
    );
};

export default Referee;
