import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Teams from './pages/admin/Teams';
import Fixture from './pages/admin/Fixture';
import Referee from './pages/Referee';
import LiveView from './pages/LiveView';

// Placeholder Pages
const Home = () => <div className="p-10 text-center flex flex-col items-center gap-4">
  <h1 className="text-4xl font-bold text-primary">Campeonato LA VIZCACHA</h1>
  <p className="text-lg text-slate-600">Sistema de Gestión de Truco</p>

  <div className="flex gap-4 mt-8">
    <a href="/inscripcion" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow font-medium">Inscripción</a>
    <a href="/live" className="px-6 py-3 bg-red-600 text-white rounded-lg shadow font-medium">Ver en Vivo</a>
  </div>

  <div className="flex gap-4 mt-4">
    <a href="/arbitro" className="text-slate-500 underline">Panel Árbitro</a>
    <a href="/admin" className="text-slate-500 underline">Panel Admin</a>
  </div>
</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-vizcacha-light text-slate-900 font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inscripcion" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="equipos" element={<Teams />} />
            <Route path="fixture" element={<Fixture />} />
          </Route>

          <Route path="/arbitro" element={<Referee />} />
          <Route path="/live" element={<LiveView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
