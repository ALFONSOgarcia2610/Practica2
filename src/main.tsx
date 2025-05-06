import { StrictMode, useState, createContext, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
 
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import DemoFormAddress from './routes/demo.form.address'
import DemoFormSimple from './routes/demo.form.simple'
import Header from './components/Header'
import TanstackQueryLayout from './integrations/tanstack-query/layout'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import App from './App.tsx'

/** === SIMULACIÓN DE AUTENTICACIÓN LOCAL === */

const VALID_USER = 'admin'
const VALID_PASS = '12345'

interface AuthContextType {
  isAuthenticated: boolean
  login: (user: string, pass: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

/** === FIN AUTENTICACIÓN === */

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
      <TanstackQueryLayout />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  DemoFormAddress(rootRoute),
  DemoFormSimple(rootRoute),
])

const router = createRouter({
  routeTree,
  context: {
    ...TanstackQuery.getContext(),
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider>
        <TanstackQuery.Provider>
          <RouterProvider router={router} />
        </TanstackQuery.Provider>
      </AuthProvider>
    </StrictMode>,
  )
}

/** === PROVIDER DE AUTENTICACIÓN === */
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (user: string, pass: string): boolean => {
    if (user === VALID_USER && pass === VALID_PASS) {
      setIsAuthenticated(true);
      return true;
    }
    setIsAuthenticated(false);
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    router.navigate({ to: '/' }); // Redirige al home después de cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

reportWebVitals()
