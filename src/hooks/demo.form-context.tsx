import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClimaByCity } from "../apis/climapi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Importamos los componentes de shadcn
import clima from "../clima.png"; 
export const DemoForm = () => {
  const [city, setCity] = useState("");

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["clima", city],
    queryFn: () => getClimaByCity(city),
    enabled: false, // La consulta no se ejecuta automáticamente
  });

  const handleSearch = () => {
    if (city.trim() === "") {
      alert("Por favor, ingresa el nombre de una ciudad");
      return;
    }
    refetch(); // Ejecuta la consulta
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <img
            src={clima}
            alt="Clima"
            className="w-16 h-16 mb-4"
          />
          <CardTitle className="text-center text-2xl font-bold text-blue-700">
            Consulta el Clima
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ingresa el nombre de una ciudad"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
          {isLoading && <p className="text-gray-500 mt-4">Cargando...</p>}
          {error && <p className="text-red-500 mt-4">Error: {(error as Error).message}</p>}
          {data && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4">
              <p className="text-lg font-semibold text-gray-700">
                Ciudad: <span className="text-blue-600">{data.name}</span>
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Temperatura: <span className="text-blue-600">{data.main.temp}°C</span>
              </p>
              <p className="text-lg font-semibold text-gray-700">
                Viento: <span className="text-blue-600">{data.wind.speed} km/h</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};