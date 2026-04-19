import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="border-dashed border-[rgba(16,46,94,0.12)] bg-white/[0.88]">
      <CardContent className="flex min-h-[260px] flex-col items-center justify-center text-center">
        <div className="rounded-[26px] bg-[linear-gradient(180deg,rgba(243,247,251,1),rgba(233,239,247,1))] p-5 text-primary shadow-soft">
          <Icon className="h-6 w-6" />
        </div>
        <p className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{title}</p>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
