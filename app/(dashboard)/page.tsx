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
import { RevenueAreaChart } from "@/components/dashboard/charts/revenue-area-chart";
import { SalesBarChart } from "@/components/dashboard/charts/sales-bar-chart";
import { TopProductsChart } from "@/components/dashboard/charts/top-products-chart";
import { RecentSalesTable } from "@/components/dashboard/recent-sales-table";
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
    <div className="space-y-5 md:space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] xl:items-stretch">
        <section className="relative overflow-hidden rounded-[28px] bg-brand-veil px-5 py-6 text-white shadow-float md:rounded-[36px] md:px-8 md:py-8">
          <div className="absolute inset-0">
            <div className="absolute right-[-44px] top-[-48px] h-60 w-60 rounded-[42%] border border-white/10" />
            <div className="absolute bottom-[-72px] left-[-40px] h-72 w-72 rounded-[45%] bg-[radial-gradient(circle_at_center,rgba(47,107,188,0.28),transparent_64%)]" />
            <div className="absolute left-[32%] top-[18%] h-48 w-48 rounded-[38%] border border-white/[0.08]" />
          </div>

          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Visao executiva
            </span>
            <h1 className="mt-5 max-w-[9ch] font-display text-[clamp(2.5rem,9vw,4.8rem)] leading-[0.92] text-white">
              Dashboard comercial
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              Vendas, faturamento e historico em leitura rapida.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3 md:mt-8 md:gap-4">
              <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm md:rounded-[28px] md:p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Semana
                </p>
                <p className="mt-3 break-words text-[clamp(1.65rem,2.4vw,2.4rem)] font-semibold tracking-[-0.05em] text-white">
                  {formatNumber(data.week.totalQuantity)}
                </p>
                <p className="mt-2 text-sm text-slate-300">Validos na semana.</p>
              </div>
              <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm md:rounded-[28px] md:p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Faturamento
                </p>
                <p className="mt-3 break-words text-[clamp(1.65rem,2.4vw,2.4rem)] font-semibold tracking-[-0.05em] text-white">
                  {formatCurrencyBRL(data.week.totalRevenue)}
                </p>
                <p className="mt-2 text-sm text-slate-300">Receita da semana.</p>
              </div>
              <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm md:rounded-[28px] md:p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Ticket medio
                </p>
                <p className="mt-3 break-words text-[clamp(1.65rem,2.4vw,2.4rem)] font-semibold tracking-[-0.05em] text-white">
                  {formatCurrencyBRL(data.month.averageTicket)}
                </p>
                <p className="mt-2 text-sm text-slate-300">Ticket do mes.</p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/sales/new"
                className={buttonVariants({
                  className:
                    "w-full !bg-none !bg-white !text-slate-950 hover:!bg-none hover:!bg-slate-100 hover:!text-slate-950 sm:w-auto"
                })}
              >
                Registrar venda
              </Link>
              <Link
                href="/reports"
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "w-full border-white/[0.15] bg-white/[0.06] text-white hover:bg-white/10 hover:text-white sm:w-auto"
                })}
              >
                Ver relatorios
              </Link>
            </div>
          </div>
        </section>

        <Card className="brand-shell brand-frost h-full overflow-hidden">
          <CardHeader>
            <CardDescription>Resumo do periodo</CardDescription>
            <CardTitle>Panorama</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[20px] border border-[rgba(16,46,94,0.08)] bg-slate-50/80 p-4 md:rounded-[24px]">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Vendas da semana</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {formatNumber(data.week.salesCount)}
                </p>
              </div>
              <div className="rounded-[20px] border border-[rgba(16,46,94,0.08)] bg-slate-50/80 p-4 md:rounded-[24px]">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Vendas do mes</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {formatNumber(data.month.salesCount)}
                </p>
              </div>
            </div>

            <div className="rounded-[22px] bg-[linear-gradient(135deg,rgba(14,43,91,0.96),rgba(23,77,143,0.96))] p-5 text-white shadow-soft md:rounded-[26px]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Produto em destaque
              </p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.04em] md:text-2xl">
                {topProduct?.productName ?? "Sem dados suficientes"}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {topProduct
                  ? `${formatNumber(topProduct.quantity)} unidades no mes.`
                  : "O ranking aparece assim que houver vendas."}
              </p>
            </div>

            <div className="rounded-[20px] border border-[rgba(16,46,94,0.08)] bg-white/90 p-4 md:rounded-[24px]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/[0.08] p-3 text-primary">
                  <PackageSearch className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Leitura rapida</p>
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Produtos vendidos"
            value={formatNumber(data.week.totalQuantity)}
            description="Vendas pagas e concluidas da semana."
            icon={Box}
          />
          <MetricCard
            title="Vendas registradas"
            value={formatNumber(data.week.salesCount)}
            description="Registros validos da semana."
            icon={ReceiptText}
            tone="accent"
          />
          <MetricCard
            title="Faturamento"
            value={formatCurrencyBRL(data.week.totalRevenue)}
            description="Receita valida da semana."
            icon={BriefcaseBusiness}
          />
          <MetricCard
            title="Ticket medio"
            value={formatCurrencyBRL(data.week.averageTicket)}
            description="Media por venda na semana."
            icon={CircleDollarSign}
            tone="success"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Mes atual
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Consolidado do mes
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Produtos vendidos"
            value={formatNumber(data.month.totalQuantity)}
            description="Volume valido do mes."
            icon={CalendarRange}
          />
          <MetricCard
            title="Vendas registradas"
            value={formatNumber(data.month.salesCount)}
            description="Registros validos do mes."
            icon={ReceiptText}
            tone="accent"
          />
          <MetricCard
            title="Faturamento do mes"
            value={formatCurrencyBRL(data.month.totalRevenue)}
            description="Receita valida do mes."
            icon={BriefcaseBusiness}
          />
          <MetricCard
            title="Ticket medio do mes"
            value={formatCurrencyBRL(data.month.averageTicket)}
            description="Media por venda no mes."
            icon={CircleDollarSign}
            tone="success"
          />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr] xl:gap-5">
        <SalesBarChart data={data.dailyWeekSales} />
        <RevenueAreaChart
          data={data.revenueTrend}
          title="Faturamento por dia"
          description="Evolucao diaria da receita no mes."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr] xl:gap-5">
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
