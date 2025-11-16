import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ShiftFormData {
  date: string;
  hours: string;
  grossEarnings: string;
}

interface ShiftFormProps {
  onSubmit?: (data: ShiftFormData) => void;
  config?: {
    avgKmPerHour: number;
    vehicleEfficiency: number;
    fuelPrice: number;
  };
}

const UBER_COMMISSION = 0.14;

export default function ShiftForm({ onSubmit, config }: ShiftFormProps) {
  const [formData, setFormData] = useState<ShiftFormData>({
    date: '',
    hours: '',
    grossEarnings: '',
  });

  // Calcular vista previa en tiempo real
  const calculations = useMemo(() => {
    const hours = parseFloat(formData.hours) || 0;
    const grossEarnings = parseInt(formData.grossEarnings) || 0;
    
    if (hours === 0 || grossEarnings === 0) {
      return null;
    }

    // Calcular comisión Uber
    const commission = Math.round(grossEarnings * UBER_COMMISSION);
    
    // Calcular gasto de combustible
    const avgKmPerHour = config?.avgKmPerHour || 25;
    const vehicleEfficiency = config?.vehicleEfficiency || 12.5;
    const fuelPrice = config?.fuelPrice || 1350;
    
    const kmTraveled = hours * avgKmPerHour;
    const litersUsed = kmTraveled / vehicleEfficiency;
    const fuelCost = Math.round(litersUsed * fuelPrice);
    
    // Calcular ganancia neta
    const netEarnings = grossEarnings - commission - fuelCost;
    
    return {
      commission,
      fuelCost,
      netEarnings,
      kmTraveled: Math.round(kmTraveled),
      litersUsed: litersUsed.toFixed(1),
    };
  }, [formData.hours, formData.grossEarnings, config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    setFormData({ date: '', hours: '', grossEarnings: '' });
  };

  return (
    <Card className="p-6" data-testid="card-shift-form">
      <h3 className="text-lg font-semibold mb-6">Registrar Nuevo Turno</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              data-testid="input-date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Horas Trabajadas</Label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              placeholder="8.5"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              required
              data-testid="input-hours"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grossEarnings">Ganancia Bruta (CLP)</Label>
            <Input
              id="grossEarnings"
              type="number"
              placeholder="42500"
              value={formData.grossEarnings}
              onChange={(e) => setFormData({ ...formData, grossEarnings: e.target.value })}
              required
              data-testid="input-gross-earnings"
            />
          </div>
        </div>

        {calculations && (
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground mb-3">
              Vista Previa del Cálculo
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ganancia Bruta</span>
                <span className="font-semibold tabular-nums">
                  ${parseInt(formData.grossEarnings).toLocaleString('es-CL')}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-red-600 dark:text-red-500">
                <span className="text-sm flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Comisión Uber (14%)
                </span>
                <span className="font-medium tabular-nums">
                  -${calculations.commission.toLocaleString('es-CL')}
                </span>
              </div>

              <div className="flex justify-between items-center text-red-600 dark:text-red-500">
                <span className="text-sm flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Combustible ({calculations.litersUsed}L, {calculations.kmTraveled}km)
                </span>
                <span className="font-medium tabular-nums">
                  -${calculations.fuelCost.toLocaleString('es-CL')}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-500" />
                  Ganancia Neta
                </span>
                <span className="text-xl font-bold tabular-nums text-green-600 dark:text-green-500">
                  ${calculations.netEarnings.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" data-testid="button-submit-shift">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Turno
          </Button>
        </div>
      </form>
    </Card>
  );
}
