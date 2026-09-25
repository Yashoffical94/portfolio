import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoadingScreen from './components/LoadingScreen'
import ScrollProgress from './components/ScrollProgress'

// Lazy-loaded pages
const Home          = lazy(() => import('./pages/Home'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const AdminLogin    = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/admin" replace />
  return children
}

function App() {
  return (
    <>
      <ScrollProgress />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/admin"       element={<AdminLogin />} />
          <Route
            path="/admin/dashboard/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
