import { useState, useEffect } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/main";
import { AlertCircle } from "lucide-react"; // Importamos el ícono de alerta
import logo from "../coa.png"; // Importa el logo

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
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-600 text-lg font-bold">
        {/* Imagen de fondo en la esquina inferior izquierda */}
        <div
          className="absolute bottom-0 left-0 w-full h-full bg-no-repeat bg-cover opacity-50"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundPosition: "left bottom", // Posiciona la imagen en la esquina inferior izquierda
            backgroundSize: "30%", // Ajusta el tamaño de la imagen
          }}
        ></div>

        {/* Contenido principal */}
        <AlertCircle className="w-12 h-12 mb-4 z-10" /> {/* Ícono de alerta */}
        <p className="z-10">No tienes acceso a esta ruta. Redirigiendo al inicio...</p>
      </div>
    );
  }

  // Renderiza el contenido si está autenticado
  return (
    <div className="relative min-h-screen">
      {/* Imagen de fondo en la esquina inferior izquierda */}
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-no-repeat bg-cover opacity-50 blur-sm"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: "left bottom", // Posiciona la imagen en la esquina inferior izquierda
          backgroundSize: "30%", // Ajusta el tamaño de la imagen
        }}
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ProtectedRoute;