import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

interface ConfigData {
  hasRent: boolean;
  weeklyRent: string;
  monthlyGoal: string;
  avgKmPerHour: string;
  vehicleEfficiency: string;
  fuelPrice: string;
}

interface ConfigurationFormProps {
  initialData?: Partial<ConfigData>;
  onSave?: (data: ConfigData) => void;
}

export default function ConfigurationForm({ initialData, onSave }: ConfigurationFormProps) {
  const [config, setConfig] = useState<ConfigData>({
    hasRent: initialData?.hasRent || false,
    weeklyRent: initialData?.weeklyRent || '',
    monthlyGoal: initialData?.monthlyGoal || '',
    avgKmPerHour: initialData?.avgKmPerHour || '',
    vehicleEfficiency: initialData?.vehicleEfficiency || '',
    fuelPrice: initialData?.fuelPrice || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(config);
  };

  return (
    <Card className="p-6" data-testid="card-configuration-form">
      <h3 className="text-lg font-semibold mb-6">Configuración</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div className="space-y-1">
            <Label htmlFor="hasRent" className="text-base font-medium">
              Trabajo con vehículo arrendado
            </Label>
            <p className="text-sm text-muted-foreground">
              Activa esta opción si pagas arriendo semanal
            </p>
          </div>
          <Switch
            id="hasRent"
            checked={config.hasRent}
            onCheckedChange={(checked) => setConfig({ ...config, hasRent: checked })}
            data-testid="switch-has-rent"
          />
        </div>

        {config.hasRent && (
          <div className="space-y-2">
            <Label htmlFor="weeklyRent">Arriendo Semanal (CLP)</Label>
            <Input
              id="weeklyRent"
              type="number"
              placeholder="150000"
              value={config.weeklyRent}
              onChange={(e) => setConfig({ ...config, weeklyRent: e.target.value })}
              data-testid="input-weekly-rent"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="monthlyGoal">Meta Mensual Líquida (CLP)</Label>
          <Input
            id="monthlyGoal"
            type="number"
            placeholder="800000"
            value={config.monthlyGoal}
            onChange={(e) => setConfig({ ...config, monthlyGoal: e.target.value })}
            required
            data-testid="input-monthly-goal"
          />
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="font-medium mb-4">Cálculo de Combustible</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="avgKmPerHour">Km promedio por hora</Label>
              <Input
                id="avgKmPerHour"
                type="number"
                step="0.1"
                placeholder="25"
                value={config.avgKmPerHour}
                onChange={(e) => setConfig({ ...config, avgKmPerHour: e.target.value })}
                required
                data-testid="input-avg-km"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleEfficiency">Rendimiento (km/L)</Label>
              <Input
                id="vehicleEfficiency"
                type="number"
                step="0.1"
                placeholder="12.5"
                value={config.vehicleEfficiency}
                onChange={(e) => setConfig({ ...config, vehicleEfficiency: e.target.value })}
                required
                data-testid="input-efficiency"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelPrice">Precio bencina (CLP/L)</Label>
              <Input
                id="fuelPrice"
                type="number"
                placeholder="1350"
                value={config.fuelPrice}
                onChange={(e) => setConfig({ ...config, fuelPrice: e.target.value })}
                required
                data-testid="input-fuel-price"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" data-testid="button-save-config">
            <Save className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </form>
    </Card>
  );
}
