import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL, formatNumber } from "@/lib/utils";
import type { PeriodSummaryRow } from "@/types/sales";

function SummaryValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

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
          <>
            <div className="grid gap-3 md:hidden">
              {rows.map((row) => (
                <div
                  key={row.periodKey}
                  className="rounded-[24px] border border-[rgba(16,46,94,0.08)] bg-white/[0.86] p-4 shadow-soft"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Período</p>
                  <p className="mt-2 text-lg font-semibold leading-tight text-slate-900">
                    {row.label}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                    <SummaryValue label="Vendas" value={formatNumber(row.salesCount)} />
                    <SummaryValue label="Qtd." value={formatNumber(row.totalQuantity)} />
                    <SummaryValue label="Receita" value={formatCurrencyBRL(row.totalRevenue)} />
                    <SummaryValue
                      label="Ticket médio"
                      value={formatCurrencyBRL(row.salesCount ? row.totalRevenue / row.salesCount : 0)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[28px] border border-[rgba(16,46,94,0.08)] md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <tr>
                      <th className="whitespace-nowrap px-5 py-4 font-medium">Período</th>
                      <th className="whitespace-nowrap px-5 py-4 font-medium">Vendas</th>
                      <th className="whitespace-nowrap px-5 py-4 font-medium">Qtd.</th>
                      <th className="whitespace-nowrap px-5 py-4 font-medium">Receita</th>
                      <th className="whitespace-nowrap px-5 py-4 font-medium">Ticket médio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white/70">
                    {rows.map((row) => (
                      <tr key={row.periodKey} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-4 font-medium text-slate-900">{row.label}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                          {formatNumber(row.salesCount)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                          {formatNumber(row.totalQuantity)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                          {formatCurrencyBRL(row.totalRevenue)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                          {formatCurrencyBRL(row.salesCount ? row.totalRevenue / row.salesCount : 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-muted-foreground">
            Nenhum dado encontrado para este intervalo.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
