import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import ProgressCard from "@/components/ProgressCard";
import EarningsChart from "@/components/EarningsChart";
import ShiftTable from "@/components/ShiftTable";
import ShiftForm from "@/components/ShiftForm";
import { DollarSign, Clock, TrendingUp, Fuel, Calendar, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  //todo: remove mock functionality
  const mockWeeklyData = [
    { day: 'Lun', earnings: 28500, hours: 6 },
    { day: 'Mar', earnings: 32100, hours: 7 },
    { day: 'Mié', earnings: 25800, hours: 5.5 },
    { day: 'Jue', earnings: 31200, hours: 6.5 },
    { day: 'Vie', earnings: 38900, hours: 8 },
    { day: 'Sáb', earnings: 42500, hours: 9 },
    { day: 'Dom', earnings: 36400, hours: 7.5 },
  ];

  const mockRecentShifts = [
    { id: '1', date: '15 Nov 2025', hours: 8.5, grossEarnings: 42500, netEarnings: 36550 },
    { id: '2', date: '14 Nov 2025', hours: 6.0, grossEarnings: 31200, netEarnings: 26832 },
    { id: '3', date: '13 Nov 2025', hours: 7.5, grossEarnings: 38900, netEarnings: 33454 },
    { id: '4', date: '12 Nov 2025', hours: 5.5, grossEarnings: 25800, netEarnings: 22188 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userName="Juan Pérez" onLogout={() => console.log('Logout')} />
      
      <div className="container py-8 px-4 md:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              Semana del 11 al 17 de Noviembre, 2025
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" data-testid="button-history">
              <Calendar className="w-4 h-4 mr-2" />
              Historial
            </Button>
            <Button variant="outline" data-testid="button-config">
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
            <TabsTrigger value="week" data-testid="tab-week">Semana</TabsTrigger>
            <TabsTrigger value="month" data-testid="tab-month">Mes</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Ganancia Neta"
                value="$185.420"
                subtitle="Esta semana"
                icon={DollarSign}
                trend={{ value: "12% vs semana anterior", isPositive: true }}
              />
              <StatCard
                title="Horas Trabajadas"
                value="38.5h"
                subtitle="Lun - Dom"
                icon={Clock}
              />
              <StatCard
                title="Promedio por Hora"
                value="$4.815"
                icon={TrendingUp}
                trend={{ value: "5% más eficiente", isPositive: true }}
              />
              <StatCard
                title="Gasto Combustible"
                value="$42.300"
                subtitle="Estimado semanal"
                icon={Fuel}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProgressCard
                title="Progreso hacia Arriendo Semanal"
                current={185420}
                target={150000}
              />
              <ProgressCard
                title="Meta Mensual"
                current={485000}
                target={800000}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EarningsChart data={mockWeeklyData} title="Ganancias por Día" />
              <EarningsChart 
                data={mockWeeklyData.map(d => ({ ...d, earnings: d.hours * 1000 }))} 
                title="Horas Trabajadas"
              />
            </div>
          </TabsContent>

          <TabsContent value="month" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Ganancia Neta"
                value="$742.680"
                subtitle="Este mes"
                icon={DollarSign}
                trend={{ value: "8% vs mes anterior", isPositive: true }}
              />
              <StatCard
                title="Horas Trabajadas"
                value="154h"
                subtitle="Nov 2025"
                icon={Clock}
              />
              <StatCard
                title="Promedio por Hora"
                value="$4.821"
                icon={TrendingUp}
              />
              <StatCard
                title="Gasto Combustible"
                value="$169.200"
                subtitle="Total mensual"
                icon={Fuel}
              />
            </div>

            <ProgressCard
              title="Meta Mensual"
              current={742680}
              target={800000}
            />
          </TabsContent>
        </Tabs>

        <ShiftForm onSubmit={(data) => console.log('Nuevo turno:', data)} />

        <ShiftTable
          shifts={mockRecentShifts}
          onEdit={(id) => console.log('Editar turno:', id)}
          onDelete={(id) => console.log('Eliminar turno:', id)}
        />
      </div>
    </div>
  );
}
