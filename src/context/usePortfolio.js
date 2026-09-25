import { useContext } from 'react'
import { PortfolioContext } from './PortfolioContext'

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
