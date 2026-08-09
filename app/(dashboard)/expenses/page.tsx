import Link from "next/link";

import { Layers3, ReceiptText, Wallet } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { ExpensesFiltersBar } from "@/components/expenses/filters-bar";
import { ExpensesPagination } from "@/components/expenses/pagination";
import { ExpensesTable } from "@/components/expenses/expenses-table";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatCurrencyBRL, formatNumber } from "@/lib/utils";
import { getExpensesPageData } from "@/services/expenses";
import { calculateTotalExpenses } from "@/utils/expenses";

export default async function ExpensesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const supabase = createServerSupabaseClient();
  const data = await getExpensesPageData(supabase, searchParams);
  const totalInPage = calculateTotalExpenses(data.expenses);

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        eyebrow="Operação"
        title="Gastos"
        description="Cadastre, filtre e acompanhe o histórico de gastos."
        action={
          <Link href="/expenses/new" className={buttonVariants({ className: "w-full sm:w-auto" })}>
            Novo gasto
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
        <MetricCard
          title="Registros encontrados"
          value={String(data.totalCount)}
          description="Gastos no filtro atual."
          icon={Layers3}
        />
        <MetricCard
          title="Categorias cadastradas"
          value={String(data.categoryOptions.length)}
          description="Categorias distintas no histórico."
          icon={ReceiptText}
          tone="accent"
        />
        <MetricCard
          title="Total nesta página"
          value={formatCurrencyBRL(totalInPage)}
          description={`${formatNumber(data.expenses.length)} gastos exibidos nesta página.`}
          icon={Wallet}
          tone="success"
        />
      </div>

      <ExpensesFiltersBar filters={data.filters} categoryOptions={data.categoryOptions} />
      <ExpensesTable expenses={data.expenses} />
      <ExpensesPagination
        currentPage={data.filters.page}
        totalPages={data.totalPages}
        filters={data.filters}
      />
    </div>
  );
}
