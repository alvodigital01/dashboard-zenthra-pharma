"use client";

import { PencilLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatCurrencyBRL, formatDateBR, formatPaymentDetails } from "@/lib/utils";
import type { ExpenseRecord } from "@/types/expenses";

export function ExpensesTable({ expenses }: { expenses: ExpenseRecord[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (expenseId: string) => {
    const confirmed = window.confirm("Deseja realmente excluir este gasto?");

    if (!confirmed) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    setDeletingId(expenseId);

    const { error } = await supabase.from("expenses").delete().eq("id", expenseId);

    setDeletingId(null);

    if (error) {
      toast.error("Não foi possível excluir o gasto.");
      return;
    }

    toast.success("Gasto excluído com sucesso.");
    startTransition(() => {
      router.refresh();
    });
  };

  if (!expenses.length) {
    return (
      <EmptyState
        title="Nenhum gasto encontrado"
        description="Ajuste os filtros ou registre um novo gasto para acompanhar o lucro real."
        icon={PencilLine}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Histórico completo</CardDescription>
        <CardTitle>Todos os gastos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="hidden overflow-hidden rounded-[28px] border border-[rgba(138,105,47,0.12)] lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Data</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Descrição</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Categoria</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Pagamento</th>
                  <th className="whitespace-nowrap px-5 py-4 font-medium">Valor</th>
                  <th className="whitespace-nowrap px-5 py-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/70">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                      {formatDateBR(expense.expense_date)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-[220px] truncate font-medium text-slate-900">
                        {expense.description}
                      </div>
                      {expense.notes ? (
                        <div className="truncate text-xs text-muted-foreground">{expense.notes}</div>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                      {expense.category ?? "Sem categoria"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                      {formatPaymentDetails(expense.payment_method, expense.installments)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                      {formatCurrencyBRL(Number(expense.amount))}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2 whitespace-nowrap">
                        <Link
                          href={`/expenses/${expense.id}/edit`}
                          className={buttonVariants({ variant: "outline", size: "sm" })}
                        >
                          <PencilLine className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                        <button
                          type="button"
                          className={buttonVariants({ variant: "ghost", size: "sm" })}
                          onClick={() => handleDelete(expense.id)}
                          disabled={deletingId === expense.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deletingId === expense.id ? "Excluindo..." : "Excluir"}
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
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="rounded-[30px] border border-[rgba(138,105,47,0.12)] bg-white/[0.86] p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{formatDateBR(expense.expense_date)}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{expense.description}</p>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {formatCurrencyBRL(Number(expense.amount))}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Categoria</p>
                  <p className="font-semibold text-slate-900">{expense.category ?? "Sem categoria"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pagamento</p>
                  <p className="font-medium text-slate-900">
                    {formatPaymentDetails(expense.payment_method, expense.installments)}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Link
                  href={`/expenses/${expense.id}/edit`}
                  className={buttonVariants({ variant: "outline", size: "sm", className: "flex-1" })}
                >
                  Editar
                </Link>
                <button
                  type="button"
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "flex-1" })}
                  onClick={() => handleDelete(expense.id)}
                  disabled={deletingId === expense.id}
                >
                  {deletingId === expense.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
