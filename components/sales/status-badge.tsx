import { cn } from "@/lib/utils";
import type { SaleStatus } from "@/types/sales";

const statusMap: Record<SaleStatus, { label: string; className: string }> = {
  pending: {
    label: "Pendente",
    className: "bg-amber-50/90 text-amber-700 ring-amber-100"
  },
  paid: {
    label: "Pago",
    className: "bg-emerald-50/90 text-emerald-700 ring-emerald-100"
  },
  completed: {
    label: "Concluído",
    className: "bg-sky-50/90 text-sky-700 ring-sky-100"
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-rose-50/90 text-rose-700 ring-rose-100"
  }
};

const fallbackStatus = {
  label: "Status",
  className: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status as SaleStatus] ?? fallbackStatus;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] ring-1 ring-inset",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
