import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL, formatDateBR } from "@/lib/utils";
import type { SaleRecord } from "@/types/sales";

import { StatusBadge } from "@/components/sales/status-badge";

export function RecentSalesTable({ sales }: { sales: SaleRecord[] }) {
  return (
    <Card className="brand-shell brand-frost overflow-hidden">
      <CardHeader className="flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <CardDescription>Movimento recente</CardDescription>
          <CardTitle>Histórico comercial</CardTitle>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Últimas vendas registradas para monitorar status, volume e faturamento com rapidez.
          </p>
        </div>
        <Link href="/sales" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Ver tudo
        </Link>
      </CardHeader>
      <CardContent>
        {sales.length ? (
          <div className="overflow-hidden rounded-[26px] border border-[rgba(16,46,94,0.08)]">
            <table className="min-w-full text-left text-sm">
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
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-muted-foreground">
            Ainda não existem vendas registradas para exibir.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
