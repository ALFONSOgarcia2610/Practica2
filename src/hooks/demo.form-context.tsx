import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClimaByCity } from "../apis/climapi";
import { Thermometer, Wind, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Importamos los componentes de shadcn
import clima from "../clima.png";
import logo from "../coa.png";
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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      {/* Imagen de fondo en la esquina inferior izquierda */}
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-no-repeat bg-cover opacity-50"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: "left bottom", // Posiciona la imagen en la esquina inferior izquierda
          backgroundSize: "30%", // Ajusta el tamaño de la imagen
        }}
      ></div>

      {/* Contenido principal */}
      <Card className="relative z-10 w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <img
            src={clima}
            alt="Clima"
            className="w-30 h-30 mb-4"
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
          {isLoading && (
            <button
              type="button"
              className="bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2 mt-4 mx-auto"
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

          {error && <p className="text-red-500 mt-4">Error: {(error as Error).message}</p>}
          {data && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4 space-y-3">
              <div className="flex items-center text-lg font-semibold text-gray-700">
                <MapPin className="mr-2 text-blue-600" />
                Ciudad: <span className="ml-1 text-blue-600">{data.name}</span>
              </div>
              <div className="flex items-center text-lg font-semibold text-gray-700">
                <Thermometer className="mr-2 text-blue-600" />
                Temperatura: <span className="ml-1 text-blue-600">{data.main.temp}°C</span>
              </div>
              <div className="flex items-center text-lg font-semibold text-gray-700">
                <Wind className="mr-2 text-blue-600" />
                Viento: <span className="ml-1 text-blue-600">{data.wind.speed} km/h</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};