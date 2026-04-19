import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL, formatNumber } from "@/lib/utils";
import type { PeriodSummaryRow } from "@/types/sales";

export function SummaryTable({
  title,
  description,
  rows
}: {
  title: string;
  description: string;
  rows: PeriodSummaryRow[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length ? (
          <div className="overflow-hidden rounded-[28px] border border-[rgba(16,46,94,0.08)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">Período</th>
                  <th className="px-5 py-4 font-medium">Vendas</th>
                  <th className="px-5 py-4 font-medium">Qtd.</th>
                  <th className="px-5 py-4 font-medium">Receita</th>
                  <th className="px-5 py-4 font-medium">Ticket médio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/70">
                {rows.map((row) => (
                  <tr key={row.periodKey} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-medium text-slate-900">{row.label}</td>
                    <td className="px-5 py-4 text-slate-700">{formatNumber(row.salesCount)}</td>
                    <td className="px-5 py-4 text-slate-700">{formatNumber(row.totalQuantity)}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {formatCurrencyBRL(row.totalRevenue)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {formatCurrencyBRL(row.salesCount ? row.totalRevenue / row.salesCount : 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-muted-foreground">
            Nenhum dado encontrado para este intervalo.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
