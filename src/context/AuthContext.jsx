import { createContext, useState, useEffect } from 'react'
import { login as apiLogin, getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verify existing token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('portfolio_token')
      if (!token) { setLoading(false); return }
      try {
        const { data } = await getMe()
        setAdmin(data.admin)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem('portfolio_token')
      } finally {
        setLoading(false)
      }
    }
    verifyToken()
  }, [])

  const login = async (email, password) => {
    const { data } = await apiLogin(email, password)
    localStorage.setItem('portfolio_token', data.token)
    setAdmin(data.admin)
    setIsAuthenticated(true)
    return data
  }

  const logout = () => {
    localStorage.removeItem('portfolio_token')
    setAdmin(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
