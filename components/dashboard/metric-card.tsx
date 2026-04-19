import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function MetricValue({ value }: { value: string }) {
  const normalized = value.replace(/\u00A0/g, " ").trim();
  const currencyMatch = normalized.match(/^R\$\s?(.*)$/);

  if (currencyMatch) {
    const amount = currencyMatch[1] ?? "";
    const [integerPart, decimalPart] = amount.split(",");
    const isLongCurrency = integerPart.replace(/\./g, "").length >= 5;

    return (
      <div className="w-full overflow-hidden">
        <div
          className={cn(
            "flex min-w-0 max-w-full items-end whitespace-nowrap leading-none",
            isLongCurrency ? "gap-0.5" : "gap-1"
          )}
        >
          <span
            className={cn(
              "shrink-0 font-semibold tracking-[-0.03em] text-slate-500",
              isLongCurrency ? "pb-0.5 text-sm" : "pb-1 text-base"
            )}
          >
            R$
          </span>
          <span
            className={cn(
              "min-w-0 truncate font-semibold text-slate-950 tabular-nums",
              isLongCurrency
                ? "text-[clamp(1.45rem,0.45vw+1.2rem,2rem)] tracking-[-0.06em]"
                : "text-[clamp(1.75rem,0.85vw+1.45rem,2.55rem)] tracking-[-0.07em]"
            )}
          >
            {integerPart}
          </span>
          {decimalPart ? (
            <span
              className={cn(
                "shrink-0 font-semibold tracking-[-0.04em] text-slate-500 tabular-nums",
                isLongCurrency
                  ? "pb-0.5 text-[0.95rem]"
                  : "pb-1 text-[clamp(0.95rem,0.28vw+0.9rem,1.2rem)]"
              )}
            >
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
      <CardHeader className="pb-4 md:pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-4">
            <CardDescription className="max-w-[14rem]">{title}</CardDescription>
            <MetricValue value={value} />
          </div>
          <div
            className={cn(
              "rounded-[18px] p-3 md:rounded-[22px] md:p-3.5",
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
        <p className="text-sm leading-6 text-muted-foreground md:leading-7">{description}</p>
      </CardContent>
    </Card>
  );
}
