import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';

const Fixture = () => {
    const [round, setRound] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    const generateFixture = async (category) => {
        setLoading(true);
        try {
            // Hardcoded for MVP: Generate for 'Pareja' or 'Trio'
            // Ideally we select which category we want to run
            const res = await axios.post('http://localhost:3001/api/rounds/generate', { category });
            if (res.data.success) {
                alert('Fixture generado con éxito!');
                fetchCurrentRound();
            }
        } catch (error) {
            console.error(error);
            alert('Error generando fixture: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentRound = async () => {
        // Fetch current round matches
        // For MVP we just show a placeholder or latest created
        // Currently API just returns { round }, we need to fetch matches for it.
        // Let's implement a GET /api/rounds/current/matches endpoint or similar later.
        // For now, simpler: we just trigger generation.
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Fixture y Rondas</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => generateFixture('Pareja')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-bold"
                        disabled={loading}
                    >
                        <PlayCircle size={20} />
                        Generar Fixture Parejas
                    </button>
                    <button
                        onClick={() => generateFixture('Trio')}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700 transition font-bold"
                        disabled={loading}
                    >
                        <PlayCircle size={20} />
                        Generar Fixture Tríos
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                <h3 className="text-lg text-slate-600 mb-4">Gestión de Partidos en Vivo</h3>
                <p className="text-slate-400 mb-8">
                    El sistema generará los cruces automáticamente basándose en el Sistema Suizo.
                    <br />Asegúrate de que todos los equipos presentes hayan hecho Check-in.
                </p>

                {/* 
                  TODO: List Matches here. 
                  We need to update backend to return matches for the round.
                */}
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg inline-block border border-yellow-200">
                    ⚠️ Esta vista está en construcción. Los fixtures se generan en segundo plano.
                </div>
            </div>
        </div>
    );
};

export default Fixture;
