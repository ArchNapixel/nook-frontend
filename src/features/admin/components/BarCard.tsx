import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TallyItem } from "../utils/tally";

type BarCardProps = {
  title: string;
  description: string;
  items: TallyItem[];
  /** Value that a full-width bar represents. */
  max: number;
};

export default function BarCard({ title, description, items, max }: BarCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map(({ label, value }) => (
            <li key={label}>
              <div className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">{label}</span>
                <span className="font-medium tabular-nums">{value}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${max ? (value / max) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
