import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/admin/login', { password });
            if (res.data.success) {
                localStorage.setItem('adminToken', res.data.token);
                navigate('/admin');
            }
        } catch (err) {
            setError('Contraseña incorrecta');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña Maestra"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
