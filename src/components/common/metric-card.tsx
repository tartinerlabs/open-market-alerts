import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export const MetricCard = ({ title, value, icon: Icon }: MetricCardProps) => {
  return (
    <div className="rounded-xl bg-surface-secondary p-6">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Icon className="size-4 text-accent" />
        {title}
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground tabular-nums">
        {value}
      </div>
    </div>
  );
};
