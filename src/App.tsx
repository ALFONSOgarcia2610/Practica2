import { useEffect, useState } from "react";
import logo from "./coa.png";
import { useAuth } from "./main";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query"; // Importar useMutation
import { loginUser } from "./db/db"; // Importar la función de inicio de sesión

function App() {
  const { isAuthenticated, setIsAuthenticated, username, setUsername } =
    useAuth();

  const [inputUser, setInputUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Configurar la mutación para el inicio de sesión
  const loginMutation = useMutation({
    mutationFn: loginUser, // Función que realiza la solicitud al backend
    onSuccess: (data) => {
      console.log("Inicio de sesión exitoso:", data);
      setIsAuthenticated(true);
      setUsername(inputUser);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", inputUser);
      localStorage.setItem("token", data.token); // Guardar el token en localStorage
      setErrorMessage("");
      setInputUser("");
      setPassword("");
    },
    onError: (error: any) => {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage(error.message || "Error al iniciar sesión");
      setIsAuthenticated(false);
      setUsername(null);
      localStorage.setItem("isAuthenticated", "false");
      localStorage.removeItem("username");
      localStorage.removeItem("token");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username: inputUser, password }); // Llamar a la mutación
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-blue-50">
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
      <Card className="relative z-10 w-full max-w-md shadow-xl/30">
        <CardHeader className="flex flex-col items-center">
          <img
            src={logo}
            className="h-40 w-40 object-contain mb-6"
            alt="logo"
          />
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            PRACTICA 2 COACMES
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loginMutation.isError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="text"
                placeholder="Usuario"
                value={inputUser}
                onChange={(e) => setInputUser(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                className="w-full bg-blue-500 transition delay-350 duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? "Cargando..." : "Iniciar sesión"}
              </Button>
            </form>
          ) : (
            <div className="text-center mt-4">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                ¡Bienvenido, {username}!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;