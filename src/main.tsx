import { StrictMode, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import DemoFormAddress from './routes/demo.form.address';
import DemoFormSimple from './routes/demo.form.simple';
import NotFoundRedirect from './routes/NotFoundRedirect.tsx';
import Header from './components/Header';
import TanstackQueryLayout from './integrations/tanstack-query/layout';
import * as TanstackQuery from './integrations/tanstack-query/root-provider';

import './styles.css';
import reportWebVitals from './reportWebVitals.ts';
import App from './App.tsx';

import { loginUser } from './db/db';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';
import { ActiveThemeProvider } from '@/components/active-theme';
import Cookies from 'js-cookie';

/** === Lógica de cookies para el tema activo === */
const activeThemeValue = Cookies.get("active_theme") || "dark"; // Obtener el tema activo desde las cookies

// Verifica si el tema tiene el sufijo "-scaled" (para ajustar el tema si es necesario)
const isScaled = activeThemeValue.endsWith("-scaled");

console.log("isScaled:", isScaled);  // Para verificar el valor de isScaled, puedes eliminar esta línea después

/** === AUTENTICACIÓN CON BACKEND === */

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  username: string | null;
  setUsername: (value: string | null) => void;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
  redirectMessage: string | null;
  setRedirectMessage: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username');
  });

  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);

  const login = async (user: string, pass: string): Promise<boolean> => {
    try {
      const response = await loginUser(user, pass);
      setIsAuthenticated(true);
      setUsername(user);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', user);
      localStorage.setItem('token', response.token);
      return true;
    } catch (error) {
      setIsAuthenticated(false);
      setUsername(null);
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    router.navigate({ to: '/' });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        username,
        setUsername,
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

// 🧠 Root layout con Toaster y proveedores de tema
const rootRoute = createRootRoute({
  component: () => (
    <ActiveThemeProvider initialTheme={activeThemeValue}>
      <ThemeProvider defaultTheme={activeThemeValue} storageKey="vite-ui-theme">
        <Header />
        <Outlet />
        <Toaster richColors position="top-center" />
        <TanStackRouterDevtools />
        <TanstackQueryLayout />
      </ThemeProvider>
    </ActiveThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  DemoFormAddress(rootRoute),
  DemoFormSimple(rootRoute),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '*',
    component: NotFoundRedirect,
  }),
]);

const router = createRouter({
  routeTree,
  context: {
    ...TanstackQuery.getContext(),
    cookies: Cookies.get(),
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TanstackQuery.Provider>
            <RouterProvider router={router} />
          </TanstackQuery.Provider>
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>
  );
}

reportWebVitals();
