import StatCard from '../StatCard';
import { DollarSign, Clock, Fuel, TrendingUp } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-background">
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
  );
}
