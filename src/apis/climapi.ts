// Función para obtener el clima directamente por el nombre de la ciudad
export async function getClimaByCity(city: string) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=df8beefb9f860900a154ce4afbfe6c8b`
  );

  if (!res.ok) {
    throw new Error("No se pudo obtener el clima para la ciudad ingresada");
  }

  return res.json();
}