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

export function RevenueAreaChart({
  data,
  title = "Faturamento por período",
  description = "Evolução diária do faturamento válido."
}: {
  data: Array<{ label: string; revenue: number }>;
  title?: string;
  description?: string;
}) {
  const hasData = data.some((entry) => entry.revenue > 0);

  if (!hasData) {
    return (
      <EmptyState
        title="Nenhum faturamento no período"
        description="Registre vendas pagas ou concluídas para visualizar a curva de faturamento."
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
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c7a662" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c52f30" stopOpacity={0} />
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
              formatter={(value: number) => [formatCurrencyBRL(value), "Faturamento"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#b4873b"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
