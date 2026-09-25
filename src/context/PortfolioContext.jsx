import { createContext, useState, useEffect, useCallback } from 'react'
import {
  getProfile, getProjects, getSkills,
  getExperience, getAchievements, getSocials
} from '../services/api'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children }) {
  const [profile, setProfile]         = useState(null)
  const [projects, setProjects]       = useState([])
  const [skills, setSkills]           = useState([])
  const [experience, setExperience]   = useState([])
  const [achievements, setAchievements] = useState([])
  const [socials, setSocials]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [
        profileRes, projectsRes, skillsRes,
        expRes, achRes, socialRes
      ] = await Promise.allSettled([
        getProfile(), getProjects(), getSkills(),
        getExperience(), getAchievements(), getSocials()
      ])

      if (profileRes.status === 'fulfilled')     setProfile(profileRes.value.data?.profile || null)
      if (projectsRes.status === 'fulfilled')    setProjects(projectsRes.value.data?.projects || [])
      if (skillsRes.status === 'fulfilled')      setSkills(skillsRes.value.data?.skills || [])
      if (expRes.status === 'fulfilled')         setExperience(expRes.value.data?.experience || [])
      if (achRes.status === 'fulfilled')         setAchievements(achRes.value.data?.achievements || [])
      if (socialRes.status === 'fulfilled')      setSocials(socialRes.value.data?.socials || [])
    } catch (err) {
      setError(err.message || 'Failed to load portfolio data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const refetchProjects = async () => {
    const { data } = await getProjects()
    setProjects(data?.projects || [])
  }
  const refetchSkills = async () => {
    const { data } = await getSkills()
    setSkills(data?.skills || [])
  }
  const refetchExperience = async () => {
    const { data } = await getExperience()
    setExperience(data?.experience || [])
  }
  const refetchAchievements = async () => {
    const { data } = await getAchievements()
    setAchievements(data?.achievements || [])
  }
  const refetchSocials = async () => {
    const { data } = await getSocials()
    setSocials(data?.socials || [])
  }

  return (
    <PortfolioContext.Provider value={{
      profile, projects, skills, experience, achievements, socials,
      loading, error, fetchAll,
      refetchProjects, refetchSkills, refetchExperience,
      refetchAchievements, refetchSocials,
      setProfile, setProjects, setSkills,
      setExperience, setAchievements, setSocials
    }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export { PortfolioContext }
