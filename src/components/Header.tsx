import { Link } from "@tanstack/react-router";
import { useAuth } from "../main";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Home, LogOut, User } from "lucide-react"; // Íconos
import logo from "../coa.png";
import climaIcon from "../clima.png"; // Imagen para "Clima"
import pokedexIcon from "../poke.png"; // Imagen para "Pokedex"

export default function Header() {
  const { isAuthenticated, logout, username } = useAuth();

  return (
    <header className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Menú lateral */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white p-2">
              <Home className="w-6 h-6" /> {/* Ícono de casa */}
              <span className="hidden sm:inline font-semibold">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-blue-50 shadow-lg">
            <nav className="flex flex-col gap-6 p-6">
              {/* Logo e Inicio */}
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-10 h-10" />
                <h2 className="text-2xl font-bold text-blue-700">COACMES</h2>
              </div>

              <hr className="border-t border-gray-300 my-4" />

              {/* Opciones del menú */}
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 text-lg font-medium text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    <Home className="w-6 h-6" />
                    Inicio
                  </Link>
                </li>

                {isAuthenticated && (
                  <>
                    <li>
                      <Link
                        to="/demo/form/Clima"
                        className="flex items-center gap-3 text-lg font-medium text-blue-700 hover:text-blue-900 transition-colors"
                      >
                        <img src={climaIcon} alt="Clima" className="w-6 h-6" />
                        Clima
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/demo/form/Pokemon"
                        className="flex items-center gap-3 text-lg font-medium text-blue-700 hover:text-blue-900 transition-colors"
                      >
                        <img src={pokedexIcon} alt="Pokedex" className="w-6 h-6" />
                        Pokedex
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 text-lg font-medium text-red-600 hover:text-red-800 transition-colors"
                      >
                        <LogOut className="w-6 h-6" />
                        Cerrar sesión
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Título y usuario */}
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold flex items-center">
              <User className="mr-2 w-6 h-6" />
              {username}
            </h1>
          </div>
        )}
      </div>
    </header>
  );
}