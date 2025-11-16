import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  current: number;
  target: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export default function ProgressCard({
  title,
  current,
  target,
  formatValue = (v) => `$${v.toLocaleString('es-CL')}`,
  className,
}: ProgressCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);

  return (
    <Card className={cn("p-6", className)} data-testid={`card-progress-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        {title}
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold tabular-nums" data-testid="text-current-value">
            {formatValue(current)}
          </span>
          <span className="text-sm text-muted-foreground">
            de {formatValue(target)}
          </span>
        </div>

        <Progress value={percentage} className="h-3" data-testid="progress-bar" />

        <div className="flex items-center justify-between text-sm">
          <span className={cn(
            "font-medium",
            percentage >= 100 ? "text-green-600 dark:text-green-500" : "text-muted-foreground"
          )}>
            {percentage.toFixed(0)}% completado
          </span>
          {remaining > 0 && (
            <span className="text-muted-foreground">
              Faltan {formatValue(remaining)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
