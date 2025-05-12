// src/hooks/ChangePasswordForm.tsx

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "../coa.png";
import { Lock } from "lucide-react";
import { changePassword } from "../db/db"; // Asegúrate de que esta función esté correctamente importada

export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      setIsSubmitting(true);
      await changePassword(currentPassword, newPassword);
      toast.success("Contraseña actualizada exitosamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Error al cambiar la contraseña.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      {/* Fondo con logo */}
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-no-repeat bg-cover opacity-40"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundPosition: "left bottom",
          backgroundSize: "30%",
        }}
      ></div>

      <Card className="relative z-10 w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <Lock className="w-12 h-12 text-primary mb-2" />
          <CardTitle className="text-center text-2xl font-bold">
            Cambiar contraseña
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Cambiando..." : "Cambiar contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
