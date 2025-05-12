// src/store/authStore.ts
import { store } from '@tanstack/react-store'
import Cookies from 'js-cookie'

export const authStore = store({
  isAuthenticated: Cookies.get('isAuthenticated') === 'true',
  username: Cookies.get('username') || null,
  token: Cookies.get('token') || null,
})

export function loginToStore(username: string, token: string) {
  // Guardar en cookies
  Cookies.set('isAuthenticated', 'true', { expires: 1 })
  Cookies.set('username', username, { expires: 1 })
  Cookies.set('token', token, { expires: 1 })

  // Actualizar estado global
  authStore.setState({
    isAuthenticated: true,
    username,
    token,
  })
}

export function logoutFromStore() {
  // Limpiar cookies
  Cookies.remove('isAuthenticated')
  Cookies.remove('username')
  Cookies.remove('token')

  // Actualizar estado global
  authStore.setState({
    isAuthenticated: false,
    username: null,
    token: null,
  })
}
