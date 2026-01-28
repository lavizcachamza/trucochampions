import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { API_URL } from '../config';

const socket = io(API_URL);

const LiveView = () => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetchMatches();

        socket.on('match_update', (updatedMatch) => {
            setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
        });

        return () => socket.off('match_update');
    }, []);

    const fetchMatches = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/matches/live`);
            setMatches(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-vizcacha-dark text-white p-8">
            <h1 className="text-4xl font-bold text-center mb-2 text-accent">CAMPEONATO LA VIZCACHA</h1>
            <p className="text-center text-slate-400 mb-12 text-xl">Resultados en Vivo</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matches.map(match => (
                    <div key={match.id} className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                        {/* Header */}
                        <div className="bg-slate-900 p-3 flex justify-between items-center border-b border-slate-700">
                            <span className="font-mono text-slate-400 font-bold">MESA {match.table_number || '?'}</span>
                            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded animate-pulse">EN VIVO</span>
                        </div>

                        {/* Scores */}
                        <div className="p-6">
                            {/* Home */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-2xl font-bold truncate w-2/3">{match.team_home?.name}</span>
                                <span className="text-4xl font-mono font-black text-accent">{match.score_home}</span>
                            </div>

                            <hr className="border-slate-700 mb-6" />

                            {/* Away */}
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold truncate w-2/3">{match.team_away?.name}</span>
                                <span className="text-4xl font-mono font-black text-white">{match.score_away}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-900/50 p-3 text-center text-sm text-slate-500">
                            {match.category}
                        </div>
                    </div>
                ))}
            </div>

            {matches.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <h2 className="text-2xl">Esperando inicio de ronda...</h2>
                </div>
            )}
        </div>
    );
};

export default LiveView;
