import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyChildPage } from './pages/MyChildPage';
import { DailyLogsPage } from './pages/DailyLogsPage';
import { TeacherReportsPage } from './pages/TeacherReportsPage';
import { TuitionPage } from './pages/TuitionPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Website Multi-Page Structure */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/curriculum" element={<CurriculumPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Authentication & Recovery Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/parent-login" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<LoginPage initialTab="register" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Authenticated Parent/User Dashboard Portal (Strict 'parent' RBAC) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="child" element={<MyChildPage />} />
            <Route path="logs" element={<DailyLogsPage />} />
            <Route path="reports" element={<TeacherReportsPage />} />
            <Route path="tuition" element={<TuitionPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Authenticated Admin Dashboard Portal (Strict 'admin' RBAC) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path=":section" element={<AdminDashboardPage />} />
          </Route>

          {/* Standalone Custom 404 Catch-All Route (no Navbar, Footer, or Navigation Buttons) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
};

export default App;
