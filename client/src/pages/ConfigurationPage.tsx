import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import ConfigurationForm from "@/components/ConfigurationForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { UserConfiguration } from "@shared/schema";

export default function ConfigurationPage() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  const { data: config } = useQuery<UserConfiguration>({
    queryKey: ["/api/configuration"],
    enabled: isAuthenticated,
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/configuration", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/configuration"] });
      toast({
        title: "Configuración guardada",
        description: "Tus cambios han sido guardados exitosamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la configuración",
      });
    },
  });

  if (authLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userName={user.name} onLogout={logout} />
      
      <div className="container py-8 px-4 md:px-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
            <p className="text-muted-foreground mt-1">
              Personaliza tus parámetros de cálculo
            </p>
          </div>
        </div>

        <div className="max-w-4xl">
          <ConfigurationForm
            initialData={{
              hasRent: config?.hasRent || false,
              weeklyRent: config?.weeklyRent?.toString() || '0',
              monthlyGoal: config?.monthlyGoal?.toString() || '800000',
              avgKmPerHour: config?.avgKmPerHour?.toString() || '25',
              vehicleEfficiency: config?.vehicleEfficiency?.toString() || '12.5',
              fuelPrice: config?.fuelPrice?.toString() || '1350',
            }}
            onSave={(data) => {
              updateConfigMutation.mutate({
                hasRent: data.hasRent,
                weeklyRent: data.hasRent ? parseInt(data.weeklyRent) : 0,
                monthlyGoal: parseInt(data.monthlyGoal),
                avgKmPerHour: parseFloat(data.avgKmPerHour),
                vehicleEfficiency: parseFloat(data.vehicleEfficiency),
                fuelPrice: parseInt(data.fuelPrice),
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
