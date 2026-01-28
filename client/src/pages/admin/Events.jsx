import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { API_URL } from '../../config';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        image_url: '',
        status: 'active'
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`${API_URL}/api/events/all`, {
                headers: { Authorization: token }
            });
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            if (editingEvent) {
                await axios.put(`${API_URL}/api/events/${editingEvent.id}`, formData, {
                    headers: { Authorization: token }
                });
            } else {
                await axios.post(`${API_URL}/api/events`, formData, {
                    headers: { Authorization: token }
                });
            }
            setShowModal(false);
            setEditingEvent(null);
            setFormData({ title: '', description: '', date: '', location: '', image_url: '', status: 'active' });
            fetchEvents();
        } catch (err) {
            alert('Error al guardar evento');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            date: event.date.split('T')[0],
            location: event.location || '',
            image_url: event.image_url || '',
            status: event.status
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este evento?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/api/events/${id}`, {
                headers: { Authorization: token }
            });
            fetchEvents();
        } catch (err) {
            alert('Error al eliminar');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Gestión de Eventos</h2>
                <button
                    onClick={() => {
                        setEditingEvent(null);
                        setFormData({ title: '', description: '', date: '', location: '', image_url: '', status: 'active' });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} /> Nuevo Evento
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                        {event.image_url && (
                            <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-slate-800 mb-2">{event.title}</h3>
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{event.description}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                                <Calendar size={16} />
                                {new Date(event.date).toLocaleDateString('es-AR')}
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                    <MapPin size={16} />
                                    {event.location}
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {event.status === 'active' ? 'Activo' : 'Inactivo'}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4">{editingEvent ? 'Editar Evento' : 'Nuevo Evento'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">URL de Imagen</label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="active">Activo</option>
                                    <option value="finished">Finalizado</option>
                                    <option value="cancelled">Cancelado</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
