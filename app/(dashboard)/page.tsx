import {
  Box,
  BriefcaseBusiness,
  CalendarRange,
  CircleDollarSign,
  PackageSearch,
  ReceiptText
} from "lucide-react";
import Link from "next/link";

import { MetricCard } from "@/components/dashboard/metric-card";
import { RecentSalesTable } from "@/components/dashboard/recent-sales-table";
import { RevenueAreaChart } from "@/components/dashboard/charts/revenue-area-chart";
import { SalesBarChart } from "@/components/dashboard/charts/sales-bar-chart";
import { TopProductsChart } from "@/components/dashboard/charts/top-products-chart";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatCurrencyBRL, formatNumber } from "@/lib/utils";
import { getDashboardData } from "@/services/sales";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const data = await getDashboardData(supabase);
  const topProduct = data.topProducts[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] xl:items-stretch">
        <section className="relative overflow-hidden rounded-[36px] bg-brand-veil px-6 py-7 text-white shadow-float md:px-8 md:py-8">
          <div className="absolute inset-0">
            <div className="absolute right-[-44px] top-[-48px] h-60 w-60 rounded-[42%] border border-white/10" />
            <div className="absolute bottom-[-72px] left-[-40px] h-72 w-72 rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(47,107,188,0.28),transparent_64%)]" />
            <div className="absolute left-[32%] top-[18%] h-48 w-48 rounded-[38%] border border-white/[0.08]" />
          </div>

          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Visão executiva
            </span>
            <h1 className="mt-6 max-w-[10ch] font-display text-[clamp(3rem,4.6vw,4.8rem)] leading-[0.92] text-white">
              Dashboard comercial
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Vendas, faturamento e histórico em leitura rápida.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Semana
                </p>
                <p className="mt-3 break-words text-[clamp(1.75rem,2.2vw,2.4rem)] font-semibold tracking-[-0.05em] text-white">
                  {formatNumber(data.week.totalQuantity)}
                </p>
                <p className="mt-2 text-sm text-slate-300">Válidos na semana.</p>
              </div>
              <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Faturamento
                </p>
                <p className="mt-3 break-words text-[clamp(1.75rem,2.2vw,2.4rem)] font-semibold tracking-[-0.05em] text-white">
                  {formatCurrencyBRL(data.week.totalRevenue)}
                </p>
                <p className="mt-2 text-sm text-slate-300">Receita da semana.</p>
              </div>
              <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Ticket médio
                </p>
                <p className="mt-3 break-words text-[clamp(1.75rem,2.2vw,2.4rem)] font-semibold tracking-[-0.05em] text-white">
                  {formatCurrencyBRL(data.month.averageTicket)}
                </p>
                <p className="mt-2 text-sm text-slate-300">Ticket do mês.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/sales/new"
                className={buttonVariants({
                  className:
                    "!bg-none !bg-white !text-slate-950 hover:!bg-none hover:!bg-slate-100 hover:!text-slate-950"
                })}
              >
                Registrar venda
              </Link>
              <Link
                href="/reports"
                className={buttonVariants({
                  variant: "outline",
                  className: "border-white/[0.15] bg-white/[0.06] text-white hover:bg-white/10 hover:text-white"
                })}
              >
                Ver relatórios
              </Link>
            </div>
          </div>
        </section>

        <Card className="brand-shell brand-frost h-full overflow-hidden">
          <CardHeader>
            <CardDescription>Resumo do período</CardDescription>
            <CardTitle>Panorama</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[24px] border border-[rgba(16,46,94,0.08)] bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Vendas da semana</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {formatNumber(data.week.salesCount)}
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(16,46,94,0.08)] bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Vendas do mês</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {formatNumber(data.month.salesCount)}
                </p>
              </div>
            </div>

            <div className="rounded-[26px] bg-[linear-gradient(135deg,rgba(14,43,91,0.96),rgba(23,77,143,0.96))] p-5 text-white shadow-soft">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Produto em destaque
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                {topProduct?.productName ?? "Sem dados suficientes"}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {topProduct
                  ? `${formatNumber(topProduct.quantity)} unidades no mês.`
                  : "O ranking aparece assim que houver vendas."}
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(16,46,94,0.08)] bg-white/90 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/[0.08] p-3 text-primary">
                  <PackageSearch className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Leitura rápida</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Volume, receita e produtos em destaque.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Semana atual
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Performance da semana
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Produtos vendidos"
            value={formatNumber(data.week.totalQuantity)}
            description="Vendas pagas e concluídas da semana."
            icon={Box}
          />
          <MetricCard
            title="Vendas registradas"
            value={formatNumber(data.week.salesCount)}
            description="Registros válidos da semana."
            icon={ReceiptText}
            tone="accent"
          />
          <MetricCard
            title="Faturamento"
            value={formatCurrencyBRL(data.week.totalRevenue)}
            description="Receita válida da semana."
            icon={BriefcaseBusiness}
          />
          <MetricCard
            title="Ticket médio"
            value={formatCurrencyBRL(data.week.averageTicket)}
            description="Média por venda na semana."
            icon={CircleDollarSign}
            tone="success"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Mês atual
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Consolidado do mês
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Produtos vendidos"
            value={formatNumber(data.month.totalQuantity)}
            description="Volume válido do mês."
            icon={CalendarRange}
          />
          <MetricCard
            title="Vendas registradas"
            value={formatNumber(data.month.salesCount)}
            description="Registros válidos do mês."
            icon={ReceiptText}
            tone="accent"
          />
          <MetricCard
            title="Faturamento do mês"
            value={formatCurrencyBRL(data.month.totalRevenue)}
            description="Receita válida do mês."
            icon={BriefcaseBusiness}
          />
          <MetricCard
            title="Ticket médio do mês"
            value={formatCurrencyBRL(data.month.averageTicket)}
            description="Média por venda no mês."
            icon={CircleDollarSign}
            tone="success"
          />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SalesBarChart data={data.dailyWeekSales} />
        <RevenueAreaChart
          data={data.revenueTrend}
          title="Faturamento por dia"
          description="Evolução diária da receita no mês."
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <TopProductsChart
          data={data.topProducts.map((product) => ({
            productName: product.productName,
            quantity: product.quantity
          }))}
        />
        <RecentSalesTable sales={data.recentSales} />
      </div>
    </div>
  );
}
