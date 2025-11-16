import Header from "@/components/Header";
import ConfigurationForm from "@/components/ConfigurationForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfigurationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header userName="Juan Pérez" onLogout={() => console.log('Logout')} />
      
      <div className="container py-8 px-4 md:px-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" data-testid="button-back">
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
              hasRent: true,
              weeklyRent: '150000',
              monthlyGoal: '800000',
              avgKmPerHour: '25',
              vehicleEfficiency: '12.5',
              fuelPrice: '1350',
            }}
            onSave={(data) => console.log('Configuración guardada:', data)}
          />
        </div>
      </div>
    </div>
  );
}
