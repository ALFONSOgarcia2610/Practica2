import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPokemonData } from "../apis/pokeapi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Importamos los componentes de shadcn
import poke from "../poke.png"; 
export const DemoForm = () => {
  const [pokemon, setPokemon] = useState("");

  // Configuración de TanStack Query
  const { data: pokemonData, error, isLoading, refetch } = useQuery({
    queryKey: ["pokemon", pokemon],
    queryFn: () => getPokemonData(pokemon.toLowerCase()),
    enabled: false, // La consulta no se ejecuta automáticamente
  });

  const handleSearch = () => {
    if (pokemon.trim() === "") {
      alert("Por favor, ingresa el nombre de un Pokémon");
      return;
    }
    refetch(); // Ejecuta la consulta
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <img
            src={poke}
            alt="Pokébola"
            className="w-16 h-16 mb-4"
          />
          <CardTitle className="text-center text-2xl font-bold text-blue-700">
            Pokédex
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            value={pokemon}
            onChange={(e) => setPokemon(e.target.value)}
            placeholder="Ingresa el nombre de un Pokémon"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
          {isLoading && <p className="text-gray-500 mt-4">Cargando...</p>}
          {error && <p className="text-red-500 mt-4">Error: Pokémon no encontrado</p>}
          {pokemonData && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4">
              <p className="text-lg font-semibold text-gray-700">
                Nombre: <span className="text-blue-600">{pokemonData.name}</span>
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Altura: <span className="text-blue-600">{pokemonData.height}</span>
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Peso: <span className="text-blue-600">{pokemonData.weight}</span>
              </p>
              <img
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
                className="w-32 h-32 mx-auto"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};