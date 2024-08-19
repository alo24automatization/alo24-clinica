import { useCallback, useEffect, useState } from 'react'

const storageName = 'userData'
export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [user, setUser] = useState(null)
  const [clinica, setClinica] = useState(null)
  const login = useCallback((jwtToken, id, user, clinica) => {
    setToken(jwtToken)
    setUserId(id)
    setUser(user)
    setClinica(clinica)
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken,
        user: user,
        clinica: clinica,
      }),
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setUser(null)
    setClinica(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))
    if (data && data.token) {
      login(data.token, data.userId, data.user, data.clinica)
    }
  }, [login])

  return { login, logout, token, userId, user, clinica, setUser }
}
