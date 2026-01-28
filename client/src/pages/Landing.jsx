import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Trophy, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const [events, setEvents] = useState([]);
    const [nextEvent, setNextEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/events`);
            const activeEvents = res.data.filter(e => e.status === 'active');
            setEvents(activeEvents);

            // Find next upcoming event
            const upcoming = activeEvents
                .filter(e => new Date(e.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

            setNextEvent(upcoming);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

                <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full">
                            <span className="text-blue-300 font-semibold text-sm">🏆 Campeonato Oficial</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                            TRUCO<br />
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                LA VIZCACHA
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
                            El torneo más emocionante de truco argentino. Competí, ganá y demostrá tu habilidad.
                        </p>

                        {nextEvent && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex flex-col md:flex-row items-center gap-4"
                            >
                                <button
                                    onClick={() => navigate('/inscripcion')}
                                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all hover:scale-105 flex items-center gap-2"
                                >
                                    Inscribirse Ahora
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </button>

                                <button
                                    onClick={() => navigate('/live')}
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition"
                                >
                                    Ver en Vivo
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Next Event Highlight */}
            {nextEvent && (
                <section className="relative py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                                <div className="flex flex-col justify-center">
                                    <span className="text-blue-400 font-semibold mb-2">Próximo Evento</span>
                                    <h2 className="text-4xl font-bold text-white mb-4">{nextEvent.title}</h2>
                                    <p className="text-slate-300 text-lg mb-6">{nextEvent.description}</p>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-3 text-slate-200">
                                            <Calendar className="text-blue-400" size={20} />
                                            <span className="font-medium">
                                                {new Date(nextEvent.date).toLocaleDateString('es-AR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        {nextEvent.location && (
                                            <div className="flex items-center gap-3 text-slate-200">
                                                <MapPin className="text-blue-400" size={20} />
                                                <span className="font-medium">{nextEvent.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => navigate('/inscripcion')}
                                        className="self-start px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                                    >
                                        Inscribirse al Evento
                                    </button>
                                </div>

                                {nextEvent.image_url && (
                                    <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
                                        <img
                                            src={nextEvent.image_url}
                                            alt={nextEvent.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Features */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Trophy, title: 'Sistema Suizo', desc: 'Emparejamientos justos y competitivos' },
                            { icon: Users, title: 'Parejas y Tríos', desc: 'Categorías para todos los equipos' },
                            { icon: Calendar, title: 'Eventos Semanales', desc: 'Torneos regulares todo el año' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition"
                            >
                                <feature.icon className="text-blue-400 mb-4" size={40} />
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Events */}
            {events.length > 1 && (
                <section className="py-16 px-4 bg-black/20">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Próximos Eventos</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {events.slice(0, 6).map((event) => (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-blue-400/50 transition"
                                >
                                    {event.image_url && (
                                        <img src={event.image_url} alt={event.title} className="w-full h-40 object-cover" />
                                    )}
                                    <div className="p-6">
                                        <h3 className="font-bold text-white mb-2">{event.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                                            <Calendar size={14} />
                                            {new Date(event.date).toLocaleDateString('es-AR')}
                                        </div>
                                        <p className="text-sm text-slate-300 line-clamp-2">{event.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/10">
                <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
                    <p>© 2026 Campeonato LA VIZCACHA. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
