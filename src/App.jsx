import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { COLORS } from './components/ui'
import { WameedLogo } from './components/ui'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import {
  Clients, ClientDetail, Capacity, FollowUp, Campaigns, AIAnalysis,
  Tasks, Reports, ChurnTracker, Targets, Scorecard, Satisfaction,
  Payroll, TeamManagement, ClientPortal, NotFound
} from './pages/index'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#070E1F] flex items-center justify-center">
      <div className="text-center">
        <WameedLogo size={48} />
        <div className="mt-4 text-white/40 text-sm font-cairo">جاري التحميل...</div>
      </div>
    </div>
  )
}

function WameedLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className="mx-auto">
      <defs>
        <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E879A0" />
          <stop offset="100%" stopColor="#7B6FE0" />
        </linearGradient>
      </defs>
      <path d="M30 2 L36 22 L56 22 L40 35 L46 55 L30 43 L14 55 L20 35 L4 22 L24 22 Z" fill="url(#lg)" />
    </svg>
  )
}

function AppRoutes() {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/portal" element={<ClientPortal />} />

      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="capacity" element={<Capacity />} />
        <Route path="followup" element={<FollowUp />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="ai" element={<AIAnalysis />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="reports" element={<Reports />} />
        <Route path="churn" element={<ChurnTracker />} />
        <Route path="targets" element={<Targets />} />
        <Route path="scorecard" element={<Scorecard />} />
        <Route path="satisfaction" element={<Satisfaction />} />
        <Route path="payroll" element={
          <ProtectedRoute adminOnly>
            <Payroll />
          </ProtectedRoute>
        } />
        <Route path="team" element={
          <ProtectedRoute adminOnly>
            <TeamManagement />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
