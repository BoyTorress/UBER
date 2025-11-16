import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface ShiftFormData {
  date: string;
  hours: string;
  grossEarnings: string;
}

interface ShiftFormProps {
  onSubmit?: (data: ShiftFormData) => void;
}

export default function ShiftForm({ onSubmit }: ShiftFormProps) {
  const [formData, setFormData] = useState<ShiftFormData>({
    date: '',
    hours: '',
    grossEarnings: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    setFormData({ date: '', hours: '', grossEarnings: '' });
  };

  return (
    <Card className="p-6" data-testid="card-shift-form">
      <h3 className="text-lg font-semibold mb-6">Registrar Nuevo Turno</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
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
