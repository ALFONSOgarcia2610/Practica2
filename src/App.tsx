import { useEffect, useState } from "react";
import logo from "./coa.png";
import { useAuth } from "./main";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "./db/db";
import { toast } from "sonner";
import Cookies from "js-cookie";

function App() {
  const { isAuthenticated, setIsAuthenticated, username, setUsername } = useAuth();

  const [inputUser, setInputUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Inicio de sesión exitoso:", data);
      setIsAuthenticated(true);
      setUsername(inputUser);

      // Expiración en días: 5 minutos = 5 / (60 * 24)
      const expirationTime = 5 / (60 * 24); // ✅ 1 minuto en días
      const now = Date.now().toString();

      Cookies.set("isAuthenticated", "true", { expires: expirationTime });
      Cookies.set("username", inputUser, { expires: expirationTime });
      Cookies.set("token", data.token, { expires: expirationTime });
      Cookies.set("cookieCreatedAt", now, { expires: expirationTime }); // ✅ Aquí se guarda el timestamp

      setErrorMessage("");
      setInputUser("");
      setPassword("");

      toast.success("Inicio de sesión exitoso", {
        position: "bottom-right",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Error al iniciar sesión:", error);
      const msg = error.message || "Error al iniciar sesión";
      setErrorMessage(msg);
      setIsAuthenticated(false);
      setUsername(null);

      Cookies.set("isAuthenticated", "false");
      Cookies.remove("username");
      Cookies.remove("token");
      Cookies.remove("cookieCreatedAt"); // Limpieza por si existía
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      return await registerUser(username, password);
    },
    onSuccess: () => {
      toast.success("Registro exitoso. Iniciando sesión automáticamente...", {
        position: "bottom-right",
      });

      loginMutation.mutate({ username: inputUser, password });
    },
    onError: (error: any) => {
      console.error("Error al registrarse:", error);
      toast.error(error.message || "Error al registrarse", {
        position: "bottom-right",
      });
    },
  });

  useEffect(() => {
    if (loginMutation.isError && errorMessage) {
      toast.error("Error de inicio de sesión", {
        description: errorMessage,
        position: "bottom-right",
        duration: 3000,
      });
    }
  }, [loginMutation.isError, errorMessage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username: inputUser, password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputUser || !password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    registerMutation.mutate({ username: inputUser, password });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-foreground">
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-no-repeat bg-cover opacity-50"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: "left bottom",
          backgroundSize: "30%",
        }}
      ></div>

      <Card className="relative z-10 w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-center text-2xl font-bold">
            {isRegister ? "REGISTRO" : "INICIO DE SESIÓN"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAuthenticated ? (
            isRegister ? (
              <form onSubmit={handleRegister} className="space-y-4">
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
                  className="w-full"
                  disabled={registerMutation.isLoading}
                >
                  {registerMutation.isLoading ? "Registrando..." : "Registrarse"}
                </Button>
                <p className="text-center text-sm">
                  ¿Ya tienes una cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="text-primary hover:underline"
                  >
                    Inicia sesión
                  </button>
                </p>
              </form>
            ) : (
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
                  className="w-full"
                  disabled={loginMutation.isLoading}
                >
                  {loginMutation.isLoading ? "Cargando..." : "Iniciar sesión"}
                </Button>
                <p className="text-center text-sm">
                  ¿No tienes una cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="text-primary hover:underline"
                  >
                    Regístrate
                  </button>
                </p>
              </form>
            )
          ) : (
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">
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
