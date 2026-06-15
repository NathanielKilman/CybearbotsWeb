import { createContext, useContext, useState } from 'react'

const TeamAuthContext = createContext(null)

const SESSION_KEY = 'cybearbots-team-access'

export function TeamAuthProvider({ children }) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return window.sessionStorage.getItem(SESSION_KEY) === 'true'
  })

  const unlock = () => {
    window.sessionStorage.setItem(SESSION_KEY, 'true')
    setIsUnlocked(true)
  }

  const lock = () => {
    window.sessionStorage.removeItem(SESSION_KEY)
    setIsUnlocked(false)
  }

  return (
    <TeamAuthContext.Provider value={{ isUnlocked, unlock, lock }}>
      {children}
    </TeamAuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTeamAuth() {
  const ctx = useContext(TeamAuthContext)
  if (!ctx) throw new Error('useTeamAuth must be used within TeamAuthProvider')
  return ctx
}
