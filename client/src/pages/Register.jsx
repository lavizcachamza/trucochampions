import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

const Register = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successData, setSuccessData] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Pareja', // Default
        email: '',
        phone: '',
        event_id: '',
        players: []
    });
    const [events, setEvents] = useState([]);

    // Helper to init players based on category
    const initPlayers = (cat) => {
        const count = cat === 'Pareja' ? 2 : 3;
        const currentPlayers = [...formData.players];
        // Resize array to match category count, preserving existing data
        const newPlayers = Array(count).fill(null).map((_, i) => currentPlayers[i] || {
            name: '', age: '', level: 'Intermedio', email: '', phone: ''
        });
        setFormData(prev => ({ ...prev, category: cat, players: newPlayers }));
    };

    // Run once on mount or category change
    React.useEffect(() => {
        fetchEvents();
        if (formData.players.length === 0) {
            initPlayers(formData.category);
        }
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/events`);
            const activeEvents = res.data.filter(e => e.status === 'active');
            setEvents(activeEvents);
            if (activeEvents.length > 0 && !formData.event_id) {
                setFormData(prev => ({ ...prev, event_id: activeEvents[0].id }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'category') {
            initPlayers(e.target.value);
        }
    };

    const handlePlayerChange = (index, field, value) => {
        const updatedPlayers = [...formData.players];
        updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
        setFormData({ ...formData, players: updatedPlayers });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/teams/register`, formData);
            if (res.data.success) {
                setSuccessData(res.data.team);
                setStep(3); // Success Step
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 3 && successData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-vizcacha-light p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border-t-8 border-green-500"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">✅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Inscripción Exitosa!</h2>
                    <p className="text-slate-600 mb-6">Tu equipo ha sido registrado correctamente.</p>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                        <h3 className="font-bold text-xl text-primary mb-1">{successData.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">{successData.category} - ID: {successData.code}</p>

                        <div className="flex justify-center mb-4">
                            <img src={successData.qr_code} alt="Team QR" className="w-48 h-48 border-2 border-white shadow-sm" />
                        </div>
                        <p className="text-xs text-slate-400">Guarda este código QR para el check-in</p>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Volver al Inicio
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-primary mb-2">Inscripción al Campeonato</h1>
                    <p className="text-slate-600">Completa los datos para asegurar tu lugar</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-100 w-full">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: step === 1 ? '50%' : '100%' }}
                        ></div>
                    </div>

                    <div className="p-6 md:p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800">
                                    <span className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-sm font-bold">1</span>
                                    Datos del Equipo
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Equipo</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                            placeholder="Ej: Los Reyes del Envido"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Evento</label>
                                        <select
                                            name="event_id"
                                            value={formData.event_id}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            required
                                        >
                                            <option value="">-- Seleccionar Evento --</option>
                                            {events.map((event) => (
                                                <option key={event.id} value={event.id}>
                                                    {event.title} - {new Date(event.date).toLocaleDateString('es-AR')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                        >
                                            <option value="Pareja">Pareja (2 Jugadores)</option>
                                            <option value="Trio">Trío (3 Jugadores)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email de Contacto</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="contacto@equipo.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="+54 9 261..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                                    >
                                        Siguiente: Jugadores →
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-800">
                                    <span className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center text-sm font-bold">2</span>
                                    Datos de los Jugadores
                                </h2>

                                <div className="space-y-6 mb-8">
                                    {formData.players.map((player, index) => (
                                        <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                            <h3 className="font-medium text-slate-700 mb-3 block border-b border-slate-200 pb-2">Jugador {index + 1}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Nombre Completo"
                                                    value={player.name}
                                                    onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                                                    required
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Edad"
                                                    value={player.age}
                                                    onChange={(e) => handlePlayerChange(index, 'age', e.target.value)}
                                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                                                />
                                                <select
                                                    value={player.level}
                                                    onChange={(e) => handlePlayerChange(index, 'level', e.target.value)}
                                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                                                >
                                                    <option value="Principiante">Principiante</option>
                                                    <option value="Intermedio">Intermedio</option>
                                                    <option value="Avanzado">Avanzado</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium transition"
                                    >
                                        ← Volver
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Registrando...' : 'CONFIRMAR INSCRIPCIÓN ✅'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
