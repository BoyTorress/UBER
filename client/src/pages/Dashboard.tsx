import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import ProgressCard from "@/components/ProgressCard";
import EarningsChart from "@/components/EarningsChart";
import ShiftTable from "@/components/ShiftTable";
import ShiftForm from "@/components/ShiftForm";
import { DollarSign, Clock, TrendingUp, Fuel, Calendar, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Shift, UserConfiguration } from "@shared/schema";

const UBER_COMMISSION = 0.14; // 14% comisión fija de Uber

export default function Dashboard() {
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

  const { data: shifts = [] } = useQuery<Shift[]>({
    queryKey: ["/api/shifts"],
    enabled: isAuthenticated,
  });

  const createShiftMutation = useMutation({
    mutationFn: async (data: { date: string; hours: string; grossEarnings: string }) => {
      const hours = parseFloat(data.hours);
      const grossEarnings = parseInt(data.grossEarnings);
      
      // Calcular gasto de combustible
      const kmTraveled = hours * (config?.avgKmPerHour || 25);
      const litersUsed = kmTraveled / (config?.vehicleEfficiency || 12.5);
      const fuelCost = Math.round(litersUsed * (config?.fuelPrice || 1350));
      
      // Calcular ganancia neta: Ganancia bruta - comisión Uber - combustible
      const netEarnings = Math.round(grossEarnings * (1 - UBER_COMMISSION) - fuelCost);

      const response = await apiRequest("POST", "/api/shifts", {
        date: new Date(data.date).toISOString(),
        hours,
        grossEarnings,
        netEarnings,
        fuelCost,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts"] });
      toast({
        title: "Turno registrado",
        description: "El turno ha sido registrado exitosamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar el turno",
      });
    },
  });

  const deleteShiftMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/shifts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts"] });
      toast({
        title: "Turno eliminado",
        description: "El turno ha sido eliminado exitosamente",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el turno",
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

  // Calcular estadísticas reales de los turnos
  const totalNetEarnings = shifts.reduce((sum, shift) => sum + shift.netEarnings, 0);
  const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0);
  const totalFuelCost = shifts.reduce((sum, shift) => sum + shift.fuelCost, 0);
  const avgPerHour = totalHours > 0 ? Math.round(totalNetEarnings / totalHours) : 0;

  const formatShiftDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const recentShifts = shifts.slice(0, 5).map(shift => ({
    id: shift.id,
    date: formatShiftDate(shift.date),
    hours: shift.hours,
    grossEarnings: shift.grossEarnings,
    netEarnings: shift.netEarnings,
  }));

  // Preparar datos para gráficos
  const weeklyData = shifts.slice(0, 7).reverse().map(shift => ({
    day: new Date(shift.date).toLocaleDateString('es-CL', { weekday: 'short' }),
    earnings: shift.netEarnings,
    hours: shift.hours,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header userName={user.name} onLogout={logout} />
      
      <div className="container py-8 px-4 md:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              Vista general de tus finanzas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" data-testid="button-history">
              <Calendar className="w-4 h-4 mr-2" />
              Historial
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/configuracion")}
              data-testid="button-config"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
            <Button data-testid="button-export">
              <FileText className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="week" data-testid="tab-week">Resumen</TabsTrigger>
            <TabsTrigger value="month" data-testid="tab-month">Estadísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Ganancia Neta Total"
                value={`$${totalNetEarnings.toLocaleString('es-CL')}`}
                subtitle={`${shifts.length} turnos registrados`}
                icon={DollarSign}
              />
              <StatCard
                title="Horas Trabajadas"
                value={`${totalHours.toFixed(1)}h`}
                subtitle="Total acumulado"
                icon={Clock}
              />
              <StatCard
                title="Promedio por Hora"
                value={`$${avgPerHour.toLocaleString('es-CL')}`}
                icon={TrendingUp}
              />
              <StatCard
                title="Gasto Combustible"
                value={`$${totalFuelCost.toLocaleString('es-CL')}`}
                subtitle="Total acumulado"
                icon={Fuel}
              />
            </div>

            {config?.hasRent && config.weeklyRent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProgressCard
                  title="Progreso hacia Arriendo Semanal"
                  current={totalNetEarnings}
                  target={config.weeklyRent}
                />
                <ProgressCard
                  title="Meta Mensual"
                  current={totalNetEarnings}
                  target={config.monthlyGoal}
                />
              </div>
            )}

            {(!config?.hasRent || !config.weeklyRent) && (
              <ProgressCard
                title="Meta Mensual"
                current={totalNetEarnings}
                target={config?.monthlyGoal || 800000}
              />
            )}

            {weeklyData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EarningsChart data={weeklyData} title="Últimos Turnos - Ganancias" />
                <EarningsChart 
                  data={weeklyData.map(d => ({ ...d, earnings: d.hours * 1000 }))} 
                  title="Últimos Turnos - Horas"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="month" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Turnos Registrados"
                value={shifts.length.toString()}
                subtitle="Total"
                icon={Calendar}
              />
              <StatCard
                title="Mejor Turno"
                value={shifts.length > 0 ? `$${Math.max(...shifts.map(s => s.netEarnings)).toLocaleString('es-CL')}` : '$0'}
                icon={TrendingUp}
              />
              <StatCard
                title="Promedio por Turno"
                value={shifts.length > 0 ? `$${Math.round(totalNetEarnings / shifts.length).toLocaleString('es-CL')}` : '$0'}
                icon={DollarSign}
              />
              <StatCard
                title="Eficiencia Combustible"
                value={totalHours > 0 ? `$${Math.round(totalFuelCost / totalHours).toLocaleString('es-CL')}/h` : '$0/h'}
                subtitle="Costo por hora"
                icon={Fuel}
              />
            </div>
          </TabsContent>
        </Tabs>

        <ShiftForm 
          onSubmit={(data) => createShiftMutation.mutate(data)}
        />

        {recentShifts.length > 0 && (
          <ShiftTable
            shifts={recentShifts}
            onEdit={(id) => console.log('Editar turno:', id)}
            onDelete={(id) => deleteShiftMutation.mutate(id)}
          />
        )}

        {shifts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No tienes turnos registrados aún
            </p>
            <p className="text-sm text-muted-foreground">
              Comienza registrando tu primer turno usando el formulario de arriba
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
