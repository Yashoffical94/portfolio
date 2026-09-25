import { useState, useCallback } from 'react'

export function useApi(apiFn) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn(...args)
      setData(res.data)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'An error occurred'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFn])

  const reset = () => { setData(null); setError(null) }

  return { data, loading, error, execute, reset }
}
