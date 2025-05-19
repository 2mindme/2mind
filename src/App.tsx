import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import QuestsPage from './pages/QuestsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PhysicalPage from './pages/PhysicalPage';
import OnboardingPage from './pages/OnboardingPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/physical" element={<PhysicalPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App; 