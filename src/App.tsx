import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Planner } from './pages/Planner';
import { Targets } from './pages/Targets';
import { FocusTimer } from './pages/FocusTimer';
import { Analytics } from './pages/Analytics';
import { MockTests } from './pages/MockTests';
import { ErrorLog } from './pages/ErrorLog';
import { DailyQuestions } from './pages/DailyQuestions';
import { Syllabus } from './pages/Syllabus';
import { Peers } from './pages/Peers';
import { Groups } from './pages/Groups';
import { Leaderboard } from './pages/Leaderboard';
import { Settings } from './pages/Settings';

import { AuthCallback } from './pages/AuthCallback';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Main Application Shell */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="planner" element={<Planner />} />
              <Route path="targets" element={<Targets />} />
              <Route path="timer" element={<FocusTimer />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="mocks" element={<MockTests />} />
              <Route path="error-log" element={<ErrorLog />} />
              <Route path="daily-questions" element={<DailyQuestions />} />
              <Route path="syllabus" element={<Syllabus />} />
              <Route path="peers" element={<Peers />} />
              <Route path="groups" element={<Groups />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
