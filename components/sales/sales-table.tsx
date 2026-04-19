"use client";

import { PencilLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/sales/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatCurrencyBRL, formatDateBR } from "@/lib/utils";
import type { SaleRecord } from "@/types/sales";

export function SalesTable({ sales }: { sales: SaleRecord[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (saleId: string) => {
    const confirmed = window.confirm("Deseja realmente excluir esta venda?");

    if (!confirmed) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    setDeletingId(saleId);

    const { error } = await supabase.from("sales").delete().eq("id", saleId);

    setDeletingId(null);

    if (error) {
      toast.error("Não foi possível excluir a venda.");
      return;
    }

    toast.success("Venda excluída com sucesso.");
    startTransition(() => {
      router.refresh();
    });
  };

  if (!sales.length) {
    return (
      <EmptyState
        title="Nenhuma venda encontrada"
        description="Ajuste os filtros ou registre uma nova venda para alimentar o painel."
        icon={PencilLine}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Histórico completo</CardDescription>
        <CardTitle>Todas as vendas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="hidden overflow-hidden rounded-[28px] border border-[rgba(16,46,94,0.08)] lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Data</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Produto</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Status</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Quantidade</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Valor unit.</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Total</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Cliente/Pedido</th>
                  <th className="whitespace-nowrap px-5 py-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/70">
                {sales.map((sale) => (
                  <tr key={sale.id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                      {formatDateBR(sale.sale_date)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-[220px] truncate font-medium text-slate-900">
                        {sale.product_name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {sale.product_category ?? "Sem categoria"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <StatusBadge status={sale.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">{sale.quantity}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                      {formatCurrencyBRL(Number(sale.unit_price))}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                      {formatCurrencyBRL(Number(sale.total_price))}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      <div className="max-w-[220px] truncate">
                        {sale.customer_name ?? sale.order_code ?? "Não informado"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2 whitespace-nowrap">
                        <Link
                          href={`/sales/${sale.id}/edit`}
                          className={buttonVariants({ variant: "outline", size: "sm" })}
                        >
                          <PencilLine className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                        <button
                          type="button"
                          className={buttonVariants({ variant: "ghost", size: "sm" })}
                          onClick={() => handleDelete(sale.id)}
                          disabled={deletingId === sale.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deletingId === sale.id ? "Excluindo..." : "Excluir"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 lg:hidden">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="rounded-[30px] border border-[rgba(16,46,94,0.08)] bg-white/[0.86] p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{formatDateBR(sale.sale_date)}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{sale.product_name}</p>
                </div>
                <StatusBadge status={sale.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Quantidade</p>
                  <p className="font-semibold text-slate-900">{sale.quantity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold text-slate-900">
                    {formatCurrencyBRL(Number(sale.total_price))}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Cliente/Pedido</p>
                  <p className="font-medium text-slate-900">
                    {sale.customer_name ?? sale.order_code ?? "Não informado"}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Link
                  href={`/sales/${sale.id}/edit`}
                  className={buttonVariants({ variant: "outline", size: "sm", className: "flex-1" })}
                >
                  Editar
                </Link>
                <button
                  type="button"
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "flex-1" })}
                  onClick={() => handleDelete(sale.id)}
                  disabled={deletingId === sale.id}
                >
                  {deletingId === sale.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
