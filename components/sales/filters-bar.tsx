"use client";

import { Download, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { buildSearchParams } from "@/lib/utils";
import type { SalesFilters } from "@/types/sales";

const periodOptions = [
  { value: "all", label: "Todo o período" },
  { value: "today", label: "Hoje" },
  { value: "last7days", label: "Últimos 7 dias" },
  { value: "thisMonth", label: "Este mês" },
  { value: "lastMonth", label: "Mês passado" },
  { value: "custom", label: "Período personalizado" }
];

const statusOptions = [
  { value: "all", label: "Todos os status" },
  { value: "pending", label: "Pendente" },
  { value: "paid", label: "Pago" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" }
];

export function FiltersBar({
  filters,
  productOptions = [],
  showStatus = true,
  showSearch = true,
  showProductFilter = true,
  allowExport = false,
  defaultPeriod = "all"
}: {
  filters: SalesFilters;
  productOptions?: string[];
  showStatus?: boolean;
  showSearch?: boolean;
  showProductFilter?: boolean;
  allowExport?: boolean;
  defaultPeriod?: SalesFilters["period"];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [formState, setFormState] = useState(filters);
  const [isPending, setIsPending] = useState(false);

  const applyFilters = (state: SalesFilters) => {
    const queryString = buildSearchParams({
      page: 1,
      search: showSearch ? state.search : "",
      product: showProductFilter ? state.product : "",
      status: showStatus ? state.status : "all",
      period: state.period,
      dateFrom: state.period === "custom" ? state.dateFrom : "",
      dateTo: state.period === "custom" ? state.dateTo : ""
    });

    setIsPending(true);
    startTransition(() => {
      router.push(`${pathname}?${queryString}`);
      router.refresh();
      setIsPending(false);
    });
  };

  const handleReset = () => {
    const resetState: SalesFilters = {
      ...filters,
      page: 1,
      search: "",
      product: "",
      status: "all",
      period: defaultPeriod,
      dateFrom: "",
      dateTo: "",
      pageSize: filters.pageSize
    };

    setFormState(resetState);
    applyFilters(resetState);
  };

  const exportHref = `/api/export/sales?${buildSearchParams({
    search: formState.search,
    product: formState.product,
    status: formState.status,
    period: formState.period,
    dateFrom: formState.period === "custom" ? formState.dateFrom : "",
    dateTo: formState.period === "custom" ? formState.dateTo : ""
  })}`;

  return (
    <Card className="bg-white/90">
      <CardContent className="pt-7">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            applyFilters(formState);
          }}
        >
          <div className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filtros e recortes
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.5fr_repeat(4,minmax(0,1fr))]">
            {showSearch ? (
              <div className="space-y-2">
                <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Busca
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                  <Input
                    value={formState.search}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, search: event.target.value }))
                    }
                    placeholder="Buscar por nome do produto"
                    className="pl-11"
                  />
                </div>
              </div>
            ) : null}

            {showProductFilter ? (
              <div className="space-y-2">
                <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Produto
                </label>
                <Select
                  value={formState.product}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, product: event.target.value }))
                  }
                >
                  <option value="">Todos os produtos</option>
                  {productOptions.map((productName) => (
                    <option key={productName} value={productName}>
                      {productName}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            {showStatus ? (
              <div className="space-y-2">
                <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Status
                </label>
                <Select
                  value={formState.status}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      status: event.target.value as SalesFilters["status"]
                    }))
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Período
              </label>
              <Select
                value={formState.period}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    period: event.target.value as SalesFilters["period"],
                    dateFrom: event.target.value === "custom" ? current.dateFrom : "",
                    dateTo: event.target.value === "custom" ? current.dateTo : ""
                  }))
                }
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                De
              </label>
              <Input
                type="date"
                value={formState.dateFrom}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, dateFrom: event.target.value }))
                }
                disabled={formState.period !== "custom"}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Até
              </label>
              <Input
                type="date"
                value={formState.dateTo}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, dateTo: event.target.value }))
                }
                disabled={formState.period !== "custom"}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[rgba(16,46,94,0.08)] pt-1">
            <Button type="submit" disabled={isPending}>
              Aplicar
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Limpar
            </Button>
            {allowExport ? (
              <Link href={exportHref} className={buttonVariants({ variant: "outline" })}>
                <Download className="h-4 w-4" />
                Exportar CSV
              </Link>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
