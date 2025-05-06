export async function getPokemonData(pokemon: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  if (!res.ok) {
    throw new Error("Pokémon no encontrado");
  }
  return res.json();
}