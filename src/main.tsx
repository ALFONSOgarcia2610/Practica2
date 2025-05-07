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
import NotFoundRedirect from './routes/NotFoundRedirect.tsx'
import Header from './components/Header'
import TanstackQueryLayout from './integrations/tanstack-query/layout'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import App from './App.tsx'
import { loginUser } from './db/db' // Importar la función de inicio de sesión
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Importar QueryClient y QueryClientProvider

/** === AUTENTICACIÓN CON BACKEND === */

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void; // Correctamente definido
  username: string | null;
  setUsername: (value: string | null) => void; // Correctamente definido
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
  redirectMessage: string | null;
  setRedirectMessage: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authState = localStorage.getItem('isAuthenticated') === 'true';
    console.log('Estado inicial de autenticación:', authState);
    return authState;
  });

  const [username, setUsername] = useState<string | null>(() => {
    const storedUsername = localStorage.getItem('username');
    console.log('Usuario inicial:', storedUsername);
    return storedUsername;
  });

  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  const login = async (user: string, pass: string): Promise<boolean> => {
    console.log('Intentando iniciar sesión con:', { user, pass });
    try {
      const response = await loginUser(user, pass);
      console.log('Respuesta del backend:', response);

      setIsAuthenticated(true); // Actualizar el estado de autenticación
      setUsername(user); // Actualizar el nombre de usuario
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', user);
      localStorage.setItem('token', response.token); // Guardar el token en localStorage

      console.log('Inicio de sesión exitoso. Usuario autenticado:', user);
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      setIsAuthenticated(false); // Restablecer el estado de autenticación
      setUsername(null); // Restablecer el nombre de usuario
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('username');
      localStorage.removeItem('token');

      console.log('Inicio de sesión fallido.');
      return false;
    }
  };

  const logout = () => {
    console.log('Cerrando sesión...');
    setIsAuthenticated(false); // Restablecer el estado de autenticación
    setUsername(null); // Restablecer el nombre de usuario
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    router.navigate({ to: '/' });
    console.log('Sesión cerrada. Usuario desautenticado.');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated, // Incluido correctamente
        username,
        setUsername, // Incluido correctamente
        login,
        logout,
        redirectMessage,
        setRedirectMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
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
  createRoute({
    getParentRoute: () => rootRoute,
    path: '*',
    component: NotFoundRedirect,
  }),
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

const queryClient = new QueryClient(); // Crear una instancia de QueryClient

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TanstackQuery.Provider>
            <RouterProvider router={router} />
          </TanstackQuery.Provider>
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>,
  )
}

reportWebVitals()