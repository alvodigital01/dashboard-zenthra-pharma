"use client";

import { AreaChart as AreaChartIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrencyBRL } from "@/lib/utils";

export function ExpensesAreaChart({
  data,
  title = "Gastos por período",
  description = "Evolução diária dos gastos."
}: {
  data: Array<{ label: string; amount: number }>;
  title?: string;
  description?: string;
}) {
  const hasData = data.some((entry) => entry.amount > 0);

  if (!hasData) {
    return (
      <EmptyState
        title="Nenhum gasto no período"
        description="Registre gastos para visualizar a curva de gastos."
        icon={AreaChartIcon}
      />
    );
  }

  return (
    <Card className="brand-shell brand-frost h-full overflow-hidden">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pt-0 sm:h-[340px] xl:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c23b3b" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#c23b3b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e4ddd2" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#756b5d", fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#756b5d", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 20,
                borderColor: "rgba(138,105,47,0.14)",
                boxShadow: "0 20px 45px -28px rgba(15, 23, 42, 0.28)",
                backgroundColor: "rgba(255,253,248,0.97)"
              }}
              formatter={(value: number) => [formatCurrencyBRL(value), "Gastos"]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#ad2323"
              strokeWidth={3}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
