import Link from "next/link";

import { StatusBadge } from "@/components/sales/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL, formatDateBR } from "@/lib/utils";
import type { SaleRecord } from "@/types/sales";

export function RecentSalesTable({ sales }: { sales: SaleRecord[] }) {
  return (
    <Card className="brand-shell brand-frost overflow-hidden">
      <CardHeader className="flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <CardDescription>Movimento recente</CardDescription>
          <CardTitle>Histórico comercial</CardTitle>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Últimas vendas registradas para acompanhar status, volume e faturamento.
          </p>
        </div>
        <Link
          href="/sales"
          className={buttonVariants({ variant: "outline", size: "sm", className: "w-full sm:w-auto" })}
        >
          Ver tudo
        </Link>
      </CardHeader>
      <CardContent>
        {sales.length ? (
          <>
            <div className="grid gap-3 md:hidden">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="rounded-[20px] border border-[rgba(16,46,94,0.08)] bg-white/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                        {formatDateBR(sale.sale_date)}
                      </p>
                      <p className="mt-1 truncate text-base font-semibold text-slate-900">
                        {sale.product_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sale.order_code ?? sale.customer_name ?? "Sem identificador"}
                      </p>
                    </div>
                    <StatusBadge status={sale.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                        Quantidade
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">{sale.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formatCurrencyBRL(Number(sale.total_price))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[22px] border border-[rgba(16,46,94,0.08)] md:block md:rounded-[26px]">
              <div className="overflow-x-auto">
                <table className="min-w-[680px] w-full text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <tr>
                      <th className="px-5 py-4 font-medium">Data</th>
                      <th className="px-5 py-4 font-medium">Produto</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                      <th className="px-5 py-4 font-medium">Quantidade</th>
                      <th className="px-5 py-4 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white/70">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="text-slate-700 transition hover:bg-slate-50/70">
                        <td className="px-5 py-4">{formatDateBR(sale.sale_date)}</td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-900">{sale.product_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {sale.order_code ?? sale.customer_name ?? "Sem identificador"}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={sale.status} />
                        </td>
                        <td className="px-5 py-4">{sale.quantity}</td>
                        <td className="px-5 py-4 text-right font-semibold text-slate-900">
                          {formatCurrencyBRL(Number(sale.total_price))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-muted-foreground md:rounded-[28px]">
            Ainda não existem vendas registradas para exibir.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
