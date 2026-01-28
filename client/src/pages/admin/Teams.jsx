import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, CheckCircle, XCircle, QrCode } from 'lucide-react';
import { API_URL } from '../../config';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/teams`);
            setTeams(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'checkin' ? 'inscripto' : 'checkin';
        try {
            await axios.put(`${API_URL}/api/teams/${id}/status`, { status: newStatus });
            fetchTeams(); // Refresh
        } catch (err) {
            alert('Error al actualizar estado');
        }
    };

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(filter.toLowerCase()) ||
        t.email.toLowerCase().includes(filter.toLowerCase()) ||
        t.code.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Gestión de Equipos</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, ID..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600">ID / Equipo</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Categoría</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Contacto</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Estado</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredTeams.map((team) => (
                            <tr key={team.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                            {/* Placeholder for QR thumbnail if needed */}
                                            <QrCode size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{team.name}</p>
                                            <p className="text-xs text-slate-500 font-mono">{team.code}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${team.category === 'Pareja' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {team.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm">{team.email}</p>
                                    <p className="text-xs text-slate-500">{team.phone}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${team.status === 'checkin' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {team.status === 'checkin' ? '✅ Check-in' : '⏳ Pendiente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleStatusChange(team.id, team.status)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${team.status === 'checkin'
                                            ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                                            }`}
                                    >
                                        {team.status === 'checkin' ? 'Deshacer' : 'Acreditar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTeams.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No se encontraron equipos.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Teams;
