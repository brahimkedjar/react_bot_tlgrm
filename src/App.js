import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import ComboManagement from './admin/ComboManagement';
import UserDashboard from './user/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/combo-management/:gameId" element={<ComboManagement />} />
      </Routes>
    </Router>
  );
}

export default App;