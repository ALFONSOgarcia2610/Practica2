import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClimaByCity } from "../apis/climapi";
import { Thermometer, Wind, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Importamos los componentes de shadcn
import clima from "../clima.png";
import logo from "../coa.png";
import { toast } from "sonner"; // Asegúrate de importar toast

export const DemoForm = () => {
  const [city, setCity] = useState("");

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["clima", city],
    queryFn: () => getClimaByCity(city),
    enabled: false, // La consulta no se ejecuta automáticamente
  });

  useEffect(() => {
    if (error) {
      toast.error("Ocurrió un error al consultar el clima", {
        description: (error as Error).message,
        position: "bottom-right",
      });
    }
  }, [error]);

  const handleSearch = () => {
    if (city.trim() === "") {
      toast.error("Por favor, ingresa el nombre de una ciudad", {
        position: "bottom-right",
      });
      return;
    }
    refetch(); // Ejecuta la consulta
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      {/* Imagen de fondo en la esquina inferior izquierda */}
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-no-repeat bg-cover opacity-50"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: "left bottom",
          backgroundSize: "30%",
        }}
      ></div>

      {/* Contenido principal */}
      <Card className="relative z-10 w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <img src={clima} alt="Clima" className="w-20 h-20 mb-4" />
          <CardTitle className="text-center text-2xl font-bold">
            Consulta el Clima
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ingresa el nombre de una ciudad"
            className="w-full p-2 border border-border rounded mb-4 bg-background text-foreground"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90"
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

          {data && (
            <div className="bg-card text-card-foreground shadow-md rounded-lg p-4 mt-4 space-y-3">
              <div className="flex items-center text-lg font-semibold">
                <MapPin className="mr-2 text-primary" />
                Ciudad: <span className="ml-1">{data.name}</span>
              </div>
              <div className="flex items-center text-lg font-semibold">
                <Thermometer className="mr-2 text-primary" />
                Temperatura: <span className="ml-1">{data.main.temp}°C</span>
              </div>
              <div className="flex items-center text-lg font-semibold">
                <Wind className="mr-2 text-primary" />
                Viento: <span className="ml-1">{data.wind.speed} km/h</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};