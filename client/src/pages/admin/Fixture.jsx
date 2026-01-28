import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayCircle, Calendar } from 'lucide-react';
import { API_URL } from '../../config';

const Fixture = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [category, setCategory] = useState('Pareja');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchActiveEvents();
    }, []);

    const fetchActiveEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/events`);
            const activeEvents = res.data.filter(e => e.status === 'active');
            setEvents(activeEvents);
            if (activeEvents.length > 0) {
                setSelectedEvent(activeEvents[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerate = async () => {
        if (!selectedEvent) {
            setMessage('Por favor selecciona un evento');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post(
                `${API_URL}/api/rounds/generate`,
                { category, event_id: selectedEvent },
                { headers: { Authorization: token } }
            );

            if (res.data.success) {
                setMessage(`✅ Fixture generado: ${res.data.matches.length} partidos creados`);
            }
        } catch (err) {
            setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Generación de Fixture</h2>

            <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
                <div className="space-y-6">
                    {/* Event Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Calendar size={18} />
                            Seleccionar Evento
                        </label>
                        <select
                            value={selectedEvent || ''}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="">-- Seleccionar Evento --</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.title} - {new Date(event.date).toLocaleDateString('es-AR')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Categoría
                        </label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setCategory('Pareja')}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${category === 'Pareja'
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                Pareja (2 jugadores)
                            </button>
                            <button
                                onClick={() => setCategory('Trio')}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${category === 'Trio'
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                Trío (3 jugadores)
                            </button>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !selectedEvent}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <PlayCircle size={20} />
                        {loading ? 'Generando...' : 'Generar Fixture'}
                    </button>

                    {/* Message */}
                    {message && (
                        <div className={`p-4 rounded-lg ${message.includes('✅')
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Nota:</strong> Solo se incluirán equipos con estado "Check-in" completado
                        que estén inscritos en el evento seleccionado.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Fixture;
