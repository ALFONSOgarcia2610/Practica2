import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../main' 

export default function NotFoundRedirect() {
  const navigate = useNavigate()
  const { setRedirectMessage } = useAuth()

  useEffect(() => {
    setRedirectMessage('Ruta no válida. Redirigido al inicio.')
    navigate({ to: '/' })
  }, [navigate, setRedirectMessage])

  return null
}