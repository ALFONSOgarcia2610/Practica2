import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPokemonData } from "../apis/pokeapi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Componentes de ShadCN
import poke from "../poke.png";

export const DemoForm = () => {
  const [pokemon, setPokemon] = useState("");

  const { data: pokemonData, error, isLoading, refetch } = useQuery({
    queryKey: ["pokemon", pokemon],
    queryFn: () => getPokemonData(pokemon.toLowerCase()),
    enabled: false,
  });

  const handleSearch = () => {
    if (pokemon.trim() === "") {
      alert("Por favor, ingresa el nombre de un Pokémon");
      return;
    }
    refetch();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <img src={poke} alt="Pokébola" className="w-16 h-16 mb-4" />
          <CardTitle className="text-center text-2xl font-bold text-blue-700">
            POKEDEX
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

          {isLoading && (
            <button
              type="button"
              className="bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2 mt-4 mx-auto cursor-progress"
              disabled
            >
              <svg
                className="w-5 h-5 animate-spin motion-reduce:hidden"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Cargando
            </button>
          )}

          {error && (
            <p className="text-red-500 mt-4">Error: Pokémon no encontrado</p>
          )}

{pokemonData && (
  <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl mt-6 flex justify-center items-center">
    <div className="md:flex items-center">
      {/* Imagen del Pokémon */}
      <div className="md:shrink-0 bg-gray-100 flex items-center justify-center">
        <img
          className="h-48 w-full object-contain md:h-full md:w-48"
          src={pokemonData.sprites.front_default}
          alt={`Sprite de ${pokemonData.name}`}
        />
      </div>

      {/* Datos del Pokémon */}
      <div className="p-8 text-center">
        <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
          {pokemonData.name}
        </div>
        <p className="mt-2 text-gray-700">
          Altura:{" "}
          <span className="text-blue-600 font-medium">
            {pokemonData.height}
          </span>
        </p>
        <p className="mt-2 text-gray-700">
          Peso:{" "}
          <span className="text-blue-600 font-medium">
            {pokemonData.weight}
          </span>
        </p>
        <p className="mt-2 text-gray-700">
          Tipo(s):{" "}
          <span className="text-blue-600 font-medium">
            {pokemonData.types.map((type: any) => type.type.name).join(", ")}
          </span>
        </p>
        <p className="mt-2 text-gray-700">
          Habilidades:{" "}
          <span className="text-blue-600 font-medium">
            {pokemonData.abilities.map((ability: any) => ability.ability.name).join(", ")}
          </span>
        </p>
      </div>
    </div>
  </div>
)}
        </CardContent>
      </Card>
    </div>
  );
};