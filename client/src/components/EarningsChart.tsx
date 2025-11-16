import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EarningsChartProps {
  data: Array<{
    day: string;
    earnings: number;
    hours: number;
  }>;
  title: string;
}

export default function EarningsChart({ data, title }: EarningsChartProps) {
  return (
    <Card className="p-6" data-testid="card-earnings-chart">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover border border-popover-border rounded-lg p-3 shadow-lg">
                    <p className="font-medium mb-1">{payload[0].payload.day}</p>
                    <p className="text-sm text-muted-foreground">
                      Ganancia: ${payload[0].value?.toLocaleString('es-CL')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Horas: {payload[0].payload.hours}h
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
