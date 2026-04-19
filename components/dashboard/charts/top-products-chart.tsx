"use client";

import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNumber } from "@/lib/utils";

export function TopProductsChart({
  data
}: {
  data: Array<{ productName: string; quantity: number }>;
}) {
  if (!data.length) {
    return (
      <EmptyState
        title="Sem ranking de produtos"
        description="Os produtos mais vendidos aparecem aqui quando houver vendas validas no mes."
        icon={BarChart3}
      />
    );
  }

  return (
    <Card className="brand-shell brand-frost h-full overflow-hidden">
      <CardHeader>
        <CardDescription>Mes atual</CardDescription>
        <CardTitle>Produtos mais vendidos</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pt-0 sm:h-[340px] xl:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="4 6" horizontal={false} stroke="#dbe4f0" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="productName"
              axisLine={false}
              tickLine={false}
              width={108}
              tick={{ fill: "#475569", fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [formatNumber(value), "Quantidade"]}
              contentStyle={{
                borderRadius: 20,
                borderColor: "rgba(16,46,94,0.08)",
                boxShadow: "0 20px 45px -28px rgba(15, 23, 42, 0.28)",
                backgroundColor: "rgba(255,255,255,0.96)"
              }}
            />
            <Bar dataKey="quantity" radius={[0, 14, 14, 0]} fill="#123b77" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
