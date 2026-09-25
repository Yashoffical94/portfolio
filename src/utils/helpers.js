// Utility helpers

export function formatDate(dateStr, options = {}) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long',
    ...options,
  })
}

export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export function truncate(str, maxLen = 120) {
  if (!str || str.length <= maxLen) return str
  return str.slice(0, maxLen).trimEnd() + '...'
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function isExternalUrl(url) {
  try {
    return new URL(url).origin !== window.location.origin
  } catch {
    return false
  }
}

export function getSkillColor(category) {
  const colors = {
    Languages: 'from-orange-500 to-orange-600',
    Frontend:  'from-navy-500 to-navy-600',
    Backend:   'from-gold-500 to-gold-600',
    'AI-ML':   'from-purple-500 to-purple-600',
    Tools:     'from-slate-500 to-slate-600',
    Other:     'from-teal-500 to-teal-600',
  }
  return colors[category] || 'from-slate-500 to-slate-600'
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key]
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}

export function sortBy(arr, key, dir = 'asc') {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return dir === 'asc' ? -1 : 1
    if (a[key] > b[key]) return dir === 'asc' ? 1  : -1
    return 0
  })
}
