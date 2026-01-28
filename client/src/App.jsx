import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Teams from './pages/admin/Teams';
import Fixture from './pages/admin/Fixture';
import Events from './pages/admin/Events';
import Referee from './pages/Referee';
import LiveView from './pages/LiveView';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-vizcacha-light text-slate-900 font-sans">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/inscripcion" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="equipos" element={<Teams />} />
            <Route path="fixture" element={<Fixture />} />
            <Route path="eventos" element={<Events />} />
          </Route>

          <Route path="/arbitro" element={<Referee />} />
          <Route path="/live" element={<LiveView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
