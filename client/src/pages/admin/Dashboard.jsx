import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { API_URL } from '../../config';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-4 rounded-full bg-${color}-50 text-${color}-600`}>
            <Icon size={24} />
        </div>
    </div>
);

const Dashboard = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/teams');
            setTeams(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando...</div>;

    const totalTeams = teams.length;
    const checkedIn = teams.filter(t => t.status === 'checkin').length;
    const couples = teams.filter(t => t.category === 'Pareja').length;
    const trios = teams.filter(t => t.category === 'Trio').length;

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard General</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Inscritos" value={totalTeams} icon={Users} color="blue" />
                <StatCard title="Check-in Completado" value={checkedIn} icon={CheckCircle} color="green" />
                <StatCard title="Parejas" value={couples} icon={Users} color="purple" />
                <StatCard title="Tríos" value={trios} icon={Users} color="orange" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-slate-700">Progreso del Evento</h3>
                    {/* Placeholder for progress bar or next steps */}
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(checkedIn / (totalTeams || 1)) * 100}%` }}></div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{checkedIn} de {totalTeams} equipos acreditados.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-slate-700">Acciones Rápidas</h3>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition">
                            Generar Fixture
                        </button>
                        <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition">
                            Exportar Lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
