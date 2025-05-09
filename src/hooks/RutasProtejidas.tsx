import { useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/main";
import { toast } from "sonner"; // Importamos toast para mostrar la alerta

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const [showToast, setShowToast] = useState(false); // Estado para controlar el `toast`

  useEffect(() => {
    if (!isAuthenticated) {
      setShowToast(true); // Activar el estado para mostrar el `toast`
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    if (showToast) {
      // Mostrar el `toast` antes de redirigir
      toast.error("No tienes acceso a esta ruta. Redirigiendo al inicio...", {
        position: "bottom-right",
        duration: 3000, // Duración de 3 segundos
      });
      setShowToast(false); // Evitar que el `toast` se muestre repetidamente
    }

    // Redirigir al inicio después de mostrar el `toast`
    return <Navigate to="/" />;
  }

  // Renderiza el contenido si está autenticado
  return <>{children}</>;
};

export default ProtectedRoute;