"use client";

import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrencyBRL, formatNumber } from "@/lib/utils";

export function SalesBarChart({
  data
}: {
  data: Array<{ label: string; quantity: number; revenue: number }>;
}) {
  const hasData = data.some((entry) => entry.quantity > 0);

  if (!hasData) {
    return (
      <EmptyState
        title="Sem vendas válidas na semana"
        description="Assim que houver vendas pagas ou concluídas, o gráfico semanal aparecerá aqui."
        icon={BarChart3}
      />
    );
  }

  return (
    <Card className="brand-shell brand-frost h-full overflow-hidden">
      <CardHeader>
        <CardDescription>Semana atual</CardDescription>
        <CardTitle>Vendas por dia</CardTitle>
      </CardHeader>
      <CardContent className="h-[360px] pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#dbe4f0" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
            <Tooltip
              cursor={{ fill: "rgba(15, 23, 42, 0.03)" }}
              contentStyle={{
                borderRadius: 20,
                borderColor: "rgba(16,46,94,0.08)",
                boxShadow: "0 20px 45px -28px rgba(15, 23, 42, 0.28)",
                backgroundColor: "rgba(255,255,255,0.96)"
              }}
              formatter={(value: number, name: string) => {
                if (name === "Quantidade") {
                  return [formatNumber(value), name];
                }

                return [formatCurrencyBRL(value), name];
              }}
            />
            <Bar dataKey="quantity" name="Quantidade" radius={[14, 14, 6, 6]} fill="#123b77" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
