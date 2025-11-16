import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Shift {
  id: string;
  date: string;
  hours: number;
  grossEarnings: number;
  netEarnings: number;
}

interface ShiftTableProps {
  shifts: Shift[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ShiftTable({ shifts, onEdit, onDelete }: ShiftTableProps) {
  return (
    <Card className="overflow-hidden" data-testid="card-shift-table">
      <div className="p-6 border-b border-card-border">
        <h3 className="text-lg font-semibold">Turnos Recientes</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Horas</TableHead>
              <TableHead className="text-right">Ganancia Bruta</TableHead>
              <TableHead className="text-right">Ganancia Neta</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id} data-testid={`row-shift-${shift.id}`}>
                <TableCell className="font-medium">{shift.date}</TableCell>
                <TableCell className="text-right tabular-nums">{shift.hours}h</TableCell>
                <TableCell className="text-right tabular-nums">
                  ${shift.grossEarnings.toLocaleString('es-CL')}
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  ${shift.netEarnings.toLocaleString('es-CL')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit?.(shift.id)}
                      data-testid={`button-edit-${shift.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete?.(shift.id)}
                      data-testid={`button-delete-${shift.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
