import { CircleDollarSign, ListChecks, PackageCheck, ReceiptText, Scale, Wallet } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueAreaChart } from "@/components/dashboard/charts/revenue-area-chart";
import { ExpensesAreaChart } from "@/components/expenses/expenses-area-chart";
import { ExpensesSummaryTable } from "@/components/expenses/summary-table";
import { SummaryTable } from "@/components/reports/summary-table";
import { FiltersBar } from "@/components/sales/filters-bar";
import { PageHeader } from "@/components/ui/page-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatCurrencyBRL, formatNumber } from "@/lib/utils";
import { getExpensesForPeriod } from "@/services/expenses";
import { getReportsData } from "@/services/sales";
import { resolveDateRange } from "@/utils/date";
import { groupExpensesByDay } from "@/utils/expenses";
import { groupSalesByDay } from "@/utils/sales";

export default async function ReportsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const supabase = createServerSupabaseClient();
  const data = await getReportsData(supabase, searchParams);
  const expensesData = await getExpensesForPeriod(
    supabase,
    data.filters.period,
    data.filters.dateFrom,
    data.filters.dateTo
  );

  const range = resolveDateRange(data.filters.period, data.filters.dateFrom, data.filters.dateTo);
  const revenueData = range
    ? groupSalesByDay(data.sales, range).map(({ label, revenue }) => ({ label, revenue }))
    : [];
  const expensesTrendData = range
    ? groupExpensesByDay(expensesData.expenses, range).map(({ label, amount }) => ({ label, amount }))
    : [];
  const realProfit = data.summary.totalRevenue - expensesData.summary.totalAmount;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Análise"
        title="Relatórios"
        description="Resultados por período, semana e mês."
      />

      <FiltersBar
        filters={data.filters}
        showSearch={false}
        showProductFilter={false}
        allowExport
        defaultPeriod="thisMonth"
      />

      <div className="rounded-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,247,251,0.9))] px-6 py-6 shadow-panel">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Leitura do período
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Compare volume, receita, vendas e ticket médio no intervalo selecionado.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          title="Itens vendidos"
          value={formatNumber(data.summary.totalQuantity)}
          description="Bancos e espumas pagos ou concluídos no período."
          icon={PackageCheck}
        />
        <MetricCard
          title="Total faturado"
          value={formatCurrencyBRL(data.summary.totalRevenue)}
          description="Receita válida no período."
          icon={CircleDollarSign}
          tone="accent"
        />
        <MetricCard
          title="Vendas registradas"
          value={formatNumber(data.summary.salesCount)}
          description="Todos os registros do período."
          icon={ListChecks}
        />
        <MetricCard
          title="Ticket médio"
          value={formatCurrencyBRL(data.summary.averageTicket)}
          description="Média por venda no período."
          icon={ReceiptText}
          tone="success"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Faturamento x gastos
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">Lucro real do período</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <MetricCard
            title="Faturamento"
            value={formatCurrencyBRL(data.summary.totalRevenue)}
            description="Receita válida no período."
            icon={CircleDollarSign}
          />
          <MetricCard
            title="Gastos"
            value={formatCurrencyBRL(expensesData.summary.totalAmount)}
            description="Total gasto no período."
            icon={Wallet}
            tone="accent"
          />
          <MetricCard
            title="Lucro real"
            value={formatCurrencyBRL(realProfit)}
            description="Faturamento menos gastos do período."
            icon={Scale}
            tone={realProfit >= 0 ? "success" : "accent"}
          />
        </div>
      </div>

      {range ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <RevenueAreaChart
            data={revenueData}
            title="Faturamento no intervalo"
            description="Curva diária do faturamento filtrado."
          />
          <ExpensesAreaChart
            data={expensesTrendData}
            title="Gastos no intervalo"
            description="Curva diária dos gastos filtrados."
          />
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 px-6 py-12 text-center text-sm text-muted-foreground shadow-panel">
          Selecione um período para ver as curvas de faturamento e gastos.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <SummaryTable
          title="Resumo semanal"
          description="Semanas reais da operação."
          rows={data.weeklyRows}
        />
        <SummaryTable
          title="Resumo mensal"
          description="Consolidado por mês."
          rows={data.monthlyRows}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ExpensesSummaryTable
          title="Resumo semanal de gastos"
          description="Semanas reais da operação."
          rows={expensesData.weeklyRows}
        />
        <ExpensesSummaryTable
          title="Resumo mensal de gastos"
          description="Consolidado por mês."
          rows={expensesData.monthlyRows}
        />
      </div>
    </div>
  );
}
