import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ShortlistedAthletes } from './pages/ShortlistedAthletes';
import { Auth } from './pages/Auth';

import { Athletes } from './pages/Athletes';
import { AthleteDetail } from './pages/AthleteDetail';
// Placeholder empty components to prevent crashes
const ReportsPlaceholder = () => <div className="p-8">Reports coming soon...</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/athletes/:id" element={<AthleteDetail />} />
        <Route path="/shortlisted" element={<ShortlistedAthletes />} />
        <Route path="/reports" element={<ReportsPlaceholder />} />
      </Routes>
    </Router>
  );
}

export default App;
