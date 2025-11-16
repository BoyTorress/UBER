import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-6", className)} data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight tabular-nums" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-2">
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn(
              "text-sm font-medium mt-2",
              trend.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="ml-4 p-2.5 rounded-xl bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}
