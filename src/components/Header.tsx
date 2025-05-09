import { Link } from "@tanstack/react-router";
import { useAuth } from "../main";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Moon, Sun, User } from "lucide-react";
import {
  DropdownMenu,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import logo from "../coa.png";
import climaIcon from "../clima.png";
import pokedexIcon from "../poke.png";
import { ThemeSelector } from "./selector";

export default function Header() {
  const { isAuthenticated, logout, username } = useAuth();
 

  return (
    <header className="bg-primary text-primary-foreground shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container flex items-center justify-between py-4">
        {/* Menú lateral */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Home className="w-6 h-6" />
              <span className="hidden sm:inline font-semibold">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-background shadow-lg">
            <nav className="flex flex-col gap-6 p-6">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-10 h-10" />
                <h2 className="text-2xl font-bold">COACMES</h2>
              </div>
              <hr className="border-t border-border my-4" />
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
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
                        className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                      >
                        <img src={climaIcon} alt="Clima" className="w-6 h-6" />
                        Clima
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/demo/form/Pokemon"
                        className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                      >
                        <img src={pokedexIcon} alt="Pokedex" className="w-6 h-6" />
                        Pokedex
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 text-lg font-medium text-destructive hover:text-destructive/80 transition-colors"
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

        {/* Lado derecho */}
        <div className="flex items-center gap-4 mr-9">
          {/* Alternador de tema */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 dark:text-yellow-300 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] text-gray-800 dark:text-gray-300 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            
          </DropdownMenu>
          <ThemeSelector />

          {/* Mostrar usuario si está autenticado */}
          {isAuthenticated && (
            <h1 className="text-lg font-bold flex items-center mr-4">
              <User className="mr-2 w-6 h-6" />
              {username}
            </h1>
          )}
        </div>
      </div>
    </header>
  );
}