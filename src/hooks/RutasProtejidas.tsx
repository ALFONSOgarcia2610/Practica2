import { useState, useEffect } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/main";
import { AlertCircle } from "lucide-react"; // Importamos el ícono de alerta

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
const [showMessage, setShowMessage] = useState(false);
  const [redirect, setRedirect] = useState(false);

useEffect(() => {
  if (!isAuthenticated) {
    setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        setRedirect(true); // Activa la redirección después de mostrar el mensaje
            }, 3000); // Muestra el mensaje durante 3 segundos
return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (redirect) {
    return <Navigate to="/" />;
  }

  if (!isAuthenticated && showMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-600 text-lg font-bold">
<AlertCircle className="w-12 h-12 mb-4" /> {/* Ícono de alerta */}
        No tienes acceso a esta ruta. Redirigiendo al inicio...
      </div>
    );
  }

  // Renderiza el contenido si está autenticado
  return <>{children}</>;
};

export default ProtectedRoute;