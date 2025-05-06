import { useState } from "react";
import logo from "./coa.png";
import { useAuth } from "./main"; // Importamos el hook del contexto
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function App() {
  const { isAuthenticated, login } = useAuth(); // Usamos el contexto
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password); // Llamamos a login del contexto
    if (!success) {
      setErrorMessage("Credenciales inválidas");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r bg-blue-50">
      <Card className="w-full max-w-md ">
        <CardHeader className="flex flex-col items-center ">
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
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Iniciar sesión
              </Button>
              {errorMessage && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </form>
          ) : (
            <p className="text-center mt-4 text-lg font-semibold text-gray-700">
              ¡Bienvenido, {username}!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
