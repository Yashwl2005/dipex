import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ShortlistedAthletes } from './pages/ShortlistedAthletes';
import { SubmissionReview } from './pages/SubmissionReview';
import { Auth } from './pages/Auth';

import { Athletes } from './pages/Athletes';

import { Evaluations } from './pages/Evaluations';

// Placeholder empty components to prevent crashes
const ReportsPlaceholder = () => <div className="p-8">Reports coming soon...</div>;
const SettingsPlaceholder = () => <div className="p-8">Settings coming soon...</div>;
const AnalyticsPlaceholder = () => <div className="p-8">Analytics coming soon...</div>;
const CompliancePlaceholder = () => <div className="p-8">Compliance coming soon...</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/analytics" element={<AnalyticsPlaceholder />} />
        <Route path="/compliance" element={<CompliancePlaceholder />} />
        <Route path="/evaluations" element={<Evaluations />} />
        <Route path="/shortlisted" element={<ShortlistedAthletes />} />
        <Route path="/reports" element={<ReportsPlaceholder />} />
        <Route path="/settings" element={<SettingsPlaceholder />} />
        <Route path="/review" element={<SubmissionReview />} />
      </Routes>
    </Router>
  );
}

export default App;
