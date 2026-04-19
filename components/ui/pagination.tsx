import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { buildSearchParams } from "@/lib/utils";
import type { SalesFilters } from "@/types/sales";

function getPaginationHref(filters: SalesFilters, page: number) {
  return `/sales?${buildSearchParams({
    page,
    search: filters.search,
    product: filters.product,
    status: filters.status,
    period: filters.period,
    dateFrom: filters.period === "custom" ? filters.dateFrom : "",
    dateTo: filters.period === "custom" ? filters.dateTo : ""
  })}`;
}

export function Pagination({
  currentPage,
  totalPages,
  filters
}: {
  currentPage: number;
  totalPages: number;
  filters: SalesFilters;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-[30px] border border-white/80 bg-white/90 p-5 shadow-panel sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Pagina <span className="font-semibold text-slate-900">{currentPage}</span> de{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={getPaginationHref(filters, Math.max(currentPage - 1, 1))}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: currentPage === 1 ? "pointer-events-none opacity-50" : ""
          })}
        >
          Anterior
        </Link>
        <Link
          href={getPaginationHref(filters, Math.min(currentPage + 1, totalPages))}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          })}
        >
          Proxima
        </Link>
      </div>
    </div>
  );
}
