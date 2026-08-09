"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { buildSearchParams } from "@/lib/utils";
import type { ExpensesFilters } from "@/types/expenses";

const periodOptions = [
  { value: "all", label: "Todo o período" },
  { value: "today", label: "Hoje" },
  { value: "last7days", label: "Últimos 7 dias" },
  { value: "thisMonth", label: "Este mês" },
  { value: "lastMonth", label: "Mês passado" },
  { value: "custom", label: "Período personalizado" }
];

export function ExpensesFiltersBar({
  filters,
  categoryOptions = []
}: {
  filters: ExpensesFilters;
  categoryOptions?: string[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [formState, setFormState] = useState(filters);
  const [isPending, setIsPending] = useState(false);

  const applyFilters = (state: ExpensesFilters) => {
    const queryString = buildSearchParams({
      page: 1,
      search: state.search,
      category: state.category,
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
    const resetState: ExpensesFilters = {
      ...filters,
      page: 1,
      search: "",
      category: "",
      period: "all",
      dateFrom: "",
      dateTo: "",
      pageSize: filters.pageSize
    };

    setFormState(resetState);
    applyFilters(resetState);
  };

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

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
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
                  placeholder="Buscar por descrição"
                  className="pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Categoria
              </label>
              <Select
                value={formState.category}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, category: event.target.value }))
                }
              >
                <option value="">Todas as categorias</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Período
              </label>
              <Select
                value={formState.period}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    period: event.target.value as ExpensesFilters["period"],
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

            <div className="grid grid-cols-2 gap-3">
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
          </div>

          <div className="flex flex-col gap-3 border-t border-[rgba(138,105,47,0.12)] pt-1 sm:flex-row sm:flex-wrap sm:items-center">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              Aplicar
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="h-4 w-4" />
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
