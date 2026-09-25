import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor – attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('portfolio_token')
      if (!window.location.pathname.includes('/admin')) {
        window.location.href = '/admin'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────
export const login = (email, password) =>
  api.post('/auth/login', { email, password })

export const getMe = () => api.get('/auth/me')

// ── Profile ───────────────────────────────────────────
export const getProfile = () => api.get('/profile')
export const updateProfile = (data) => api.put('/admin/profile', data)

// ── Projects ──────────────────────────────────────────
export const getProjects = (params) => api.get('/projects', { params })
export const getProject = (id) => api.get(`/projects/${id}`)
export const createProject = (data) => api.post('/admin/projects', data)
export const updateProject = (id, data) => api.put(`/admin/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/admin/projects/${id}`)

// ── Skills ────────────────────────────────────────────
export const getSkills = () => api.get('/skills')
export const createSkill = (data) => api.post('/admin/skills', data)
export const updateSkill = (id, data) => api.put(`/admin/skills/${id}`, data)
export const deleteSkill = (id) => api.delete(`/admin/skills/${id}`)

// ── Experience ────────────────────────────────────────
export const getExperience = () => api.get('/experience')
export const createExperience = (data) => api.post('/admin/experience', data)
export const updateExperience = (id, data) => api.put(`/admin/experience/${id}`, data)
export const deleteExperience = (id) => api.delete(`/admin/experience/${id}`)

// ── Achievements ──────────────────────────────────────
export const getAchievements = () => api.get('/achievements')
export const createAchievement = (data) => api.post('/admin/achievements', data)
export const updateAchievement = (id, data) => api.put(`/admin/achievements/${id}`, data)
export const deleteAchievement = (id) => api.delete(`/admin/achievements/${id}`)

// ── Social Links ──────────────────────────────────────
export const getSocials = () => api.get('/socials')
export const getAllSocials = () => api.get('/admin/socials')
export const createSocial = (data) => api.post('/admin/socials', data)
export const updateSocial = (id, data) => api.put(`/admin/socials/${id}`, data)
export const deleteSocial = (id) => api.delete(`/admin/socials/${id}`)

// ── Contact ───────────────────────────────────────────
export const submitContact = (data) => api.post('/contact', data)
export const getMessages = () => api.get('/admin/messages')
export const getMessage = (id) => api.get(`/admin/messages/${id}`)
export const updateMessageStatus = (id, data) => api.put(`/admin/messages/${id}`, data)
export const deleteMessage = (id) => api.delete(`/admin/messages/${id}`)

export default api
