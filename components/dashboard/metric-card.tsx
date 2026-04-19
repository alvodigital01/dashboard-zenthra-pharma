import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function MetricValue({ value }: { value: string }) {
  const normalized = value.replace(/\u00A0/g, " ").trim();
  const currencyMatch = normalized.match(/^R\$\s?(.*)$/);

  if (currencyMatch) {
    const amount = currencyMatch[1] ?? "";
    const [integerPart, decimalPart] = amount.split(",");

    return (
      <div className="w-full overflow-hidden">
        <div className="flex min-w-0 max-w-full items-end gap-1 whitespace-nowrap leading-none">
          <span className="shrink-0 pb-1 text-base font-semibold tracking-[-0.03em] text-slate-500">
            R$
          </span>
          <span className="min-w-0 truncate text-[clamp(1.75rem,0.85vw+1.45rem,2.55rem)] font-semibold tracking-[-0.07em] text-slate-950 tabular-nums">
            {integerPart}
          </span>
          {decimalPart ? (
            <span className="shrink-0 pb-1 text-[clamp(0.95rem,0.28vw+0.9rem,1.2rem)] font-semibold tracking-[-0.04em] text-slate-500 tabular-nums">
              ,{decimalPart}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <CardTitle className="text-[clamp(2rem,2vw+1.1rem,3rem)] leading-[0.94] tracking-[-0.05em] text-slate-950 tabular-nums">
      {value}
    </CardTitle>
  );
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "default",
  className
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "accent";
  className?: string;
}) {
  return (
    <Card className={cn("brand-shell brand-frost flex h-full flex-col overflow-hidden", className)}>
      <CardHeader className="pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-4">
            <CardDescription className="max-w-[14rem]">{title}</CardDescription>
            <MetricValue value={value} />
          </div>
          <div
            className={cn(
              "rounded-[22px] p-3.5",
              tone === "success"
                ? "bg-emerald-50 text-emerald-700"
                : tone === "accent"
                  ? "bg-sky-50 text-sky-700"
                  : "bg-slate-100 text-slate-700"
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-0">
        <div className="brand-divider mb-4 h-px w-full" />
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
