"use client";

import { useThemeConfig } from "./active-theme";
import { useTheme } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";

const DEFAULT_THEMES = [
  { name: "Default", value: "default" },
  { name: "Azul", value: "blue" },
  { name: "Verde", value: "green" },
  { name: "Ambar", value: "amber" },
];

const INTERFACE_MODES = [
  { name: "Claro", value: "__light", icon: Sun },
  { name: "Oscuro", value: "__dark", icon: Moon },
];

const themeColors: Record<string, string> = {
  default: "bg-neutral-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  amber: "bg-amber-500",
  "default-scaled": "bg-neutral-400",
  "blue-scaled": "bg-blue-400",
  "mono-scaled": "bg-gray-600",
};

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();
  const { setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(activeTheme);

  const handleChange = (value: string) => {
    if (value.startsWith("__")) {
      // Cambiar solo el modo de interfaz
      setTheme(value.replace("__", "") as "light" | "dark" | "system");
    } else {
      setActiveTheme(value);
      setSelectedTheme(value); // Solo actualiza el valor mostrado si es un tema de color
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Label htmlFor="theme-selector" className="flex flex-col gap-1">
        <Select onValueChange={handleChange}>
          <SelectTrigger id="theme-selector" className="w-25">
            <div className="flex items-center gap-1">
              <span
                className={`w-2.5 h-2.5 rounded-full border border-black inline-block ${themeColors[selectedTheme]}`}
              />
              <span className="text-sm capitalize">{selectedTheme.replace(/-scaled/, "").replace("mono", "Monospaced")}</span>
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-xs">Temas</SelectLabel>
              {DEFAULT_THEMES.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  <span className={`w-2.5 h-2.5 rounded-full border border-black inline-block mr-2 ${themeColors[theme.value]}`} />
                  {theme.name}
                </SelectItem>
              ))}
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectLabel className="text-xs">Modo de Interfaz</SelectLabel>
              {INTERFACE_MODES.map((mode) => (
                <SelectItem key={mode.value} value={mode.value}>
                  <mode.icon className="w-3 h-3 mr-2" />
                  {mode.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>
    </div>
  );
}
