import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL, formatNumber } from "@/lib/utils";
import type { ExpensePeriodSummaryRow } from "@/types/expenses";

function SummaryValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function ExpensesSummaryTable({
  title,
  description,
  rows
}: {
  title: string;
  description: string;
  rows: ExpensePeriodSummaryRow[];
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
                  className="rounded-[24px] border border-[rgba(138,105,47,0.12)] bg-white/[0.86] p-4 shadow-soft"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Período</p>
                  <p className="mt-2 text-lg font-semibold leading-tight text-slate-900">
                    {row.label}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                    <SummaryValue label="Gastos" value={formatNumber(row.expensesCount)} />
                    <SummaryValue label="Total" value={formatCurrencyBRL(row.totalAmount)} />
                    <SummaryValue
                      label="Gasto médio"
                      value={formatCurrencyBRL(row.expensesCount ? row.totalAmount / row.expensesCount : 0)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[28px] border border-[rgba(138,105,47,0.12)] md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <tr>
                      <th className="whitespace-nowrap px-5 py-4 font-medium">Período</th>
                      <th className="whitespace-nowrap px-5 py-4 font-medium">Gastos</th>
                      <th className="whitespace-nowrap px-5 py-4 font-medium">Total</th>
                      <th className="whitespace-nowrap px-5 py-4 font-medium">Gasto médio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white/70">
                    {rows.map((row) => (
                      <tr key={row.periodKey} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-4 font-medium text-slate-900">{row.label}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                          {formatNumber(row.expensesCount)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                          {formatCurrencyBRL(row.totalAmount)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                          {formatCurrencyBRL(row.expensesCount ? row.totalAmount / row.expensesCount : 0)}
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
