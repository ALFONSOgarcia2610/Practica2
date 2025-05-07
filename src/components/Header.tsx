import { Link } from "@tanstack/react-router";
import { useAuth } from "../main";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Home, LogOut, User } from "lucide-react"; // Importamos el ícono de casa
import logo from "../coa.png";
import climaIcon from "../clima.png"; // Imagen para "Clima"
import pokedexIcon from "../poke.png"; // Imagen para "Pokedex"

export default function Header() {
  const { isAuthenticated, logout, username } = useAuth();

  return (
    <header className="p-4 bg-blue-600 bg-opacity-80 backdrop-blur-md text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white p-2">

              <Home className="w-6 h-6" /> {/* Ícono de casa */}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-blue-50">
            <nav className="flex flex-col gap-4 p-4">
              <div className="font-bold text-lg text-blue-700 flex items-center gap-2">
                <img src={logo} alt="Pokedex" className="w-6 h-6" /> {/* Imagen de Pokedex */}
                <Link to="/" className="hover:underline">
                  INICIO
                </Link>
              </div>

              {isAuthenticated && (
                <>
                  <div className="font-bold text-lg text-blue-700 flex items-center gap-2">
                    <img src={climaIcon} alt="Clima" className="w-6 h-6" /> {/* Imagen de Clima */}
                    <Link to="/demo/form/Clima" className="hover:underline">
                      Clima
                    </Link>
                  </div>

                  <div className="font-bold text-lg text-blue-700 flex items-center gap-2">
                    <img src={pokedexIcon} alt="Pokedex" className="w-6 h-6" /> {/* Imagen de Pokedex */}
                    <Link to="/demo/form/Pokemon" className="hover:underline">
                      Pokedex
                    </Link>
                  </div>

                  <div className="font-bold text-lg text-red-600">
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-red-600 hover:underline"
                    >
                      <LogOut className="w-5 h-5" /> {/* Ícono de cerrar sesión */}
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-bold flex items-center">
          <User className="mr-2" />
          {username}
        </h1>
      </div>
    </header>
  );
}