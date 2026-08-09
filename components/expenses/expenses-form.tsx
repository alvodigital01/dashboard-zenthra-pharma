"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CREDIT_CARD_MAX_INSTALLMENTS,
  EXPENSE_CATEGORIES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS
} from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatCurrencyBRL, formatPaymentDetails } from "@/lib/utils";
import type {
  ExpenseInsert,
  ExpensePaymentMethod,
  ExpenseRecord,
  ExpenseUpdate
} from "@/types/expenses";

const expenseSchema = z
  .object({
    expenseDate: z.string().min(1, "A data do gasto é obrigatória."),
    description: z.string().min(1, "Informe uma descrição para o gasto."),
    category: z.string().optional(),
    amount: z.coerce.number().positive("O valor deve ser maior que zero."),
    paymentMethod: z.enum(PAYMENT_METHODS),
    installments: z.coerce
      .number()
      .int()
      .min(1, "Escolha pelo menos 1 parcela.")
      .max(CREDIT_CARD_MAX_INSTALLMENTS, `Parcelamento limitado a ${CREDIT_CARD_MAX_INSTALLMENTS}x.`)
      .optional(),
    notes: z.string().optional()
  })
  .superRefine((values, ctx) => {
    if (values.paymentMethod === "credit_card" && !values.installments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["installments"],
        message: "Selecione o parcelamento do cartão."
      });
    }
  });

type ExpenseFormValues = z.infer<typeof expenseSchema>;

function sanitizeOptional(value?: string) {
  return value?.trim() ? value.trim() : null;
}

function mapExpensesError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("row-level security")) {
    return "Sua sessão não tem permissão para salvar este gasto. Entre novamente e tente de novo.";
  }

  if (normalized.includes("violates foreign key constraint")) {
    return "Não foi possível vincular o gasto ao usuário atual. Entre novamente e tente de novo.";
  }

  if (normalized.includes("violates check constraint")) {
    return "Revise valor, forma de pagamento e parcelamento antes de salvar.";
  }

  return "Não foi possível salvar o gasto agora. Tente novamente.";
}

export function ExpensesForm({
  initialData
}: {
  initialData?: ExpenseRecord | null;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseDate: initialData?.expense_date ?? new Date().toISOString().slice(0, 10),
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      amount: Number(initialData?.amount ?? 0),
      paymentMethod: initialData?.payment_method ?? "pix",
      installments: initialData?.installments ?? 1,
      notes: initialData?.notes ?? ""
    }
  });

  const amount = watch("amount");
  const paymentMethod = watch("paymentMethod");
  const installments = watch("installments");

  const onSubmit = async (values: ExpenseFormValues) => {
    const supabase = createBrowserSupabaseClient();
    setIsPending(true);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsPending(false);
      toast.error("Sua sessão expirou. Entre novamente para cadastrar o gasto.");
      return;
    }

    const basePayload = {
      expense_date: values.expenseDate,
      description: values.description.trim(),
      category: sanitizeOptional(values.category),
      amount: values.amount,
      payment_method: values.paymentMethod as ExpensePaymentMethod,
      installments: values.paymentMethod === "credit_card" ? values.installments ?? 1 : null,
      notes: sanitizeOptional(values.notes)
    };

    const insertPayload: ExpenseInsert = {
      ...basePayload,
      user_id: user.id
    };

    const updatePayload: ExpenseUpdate = basePayload;
    const expensesTable = supabase.from("expenses") as unknown as {
      insert: (payload: ExpenseInsert) => {
        select: (columns: string) => {
          single: () => Promise<{ error: { message: string } | null }>;
        };
      };
      update: (payload: ExpenseUpdate) => {
        eq: (column: "id", value: string) => {
          select: (columns: string) => {
            single: () => Promise<{ error: { message: string } | null }>;
          };
        };
      };
    };

    const response = initialData
      ? await expensesTable.update(updatePayload).eq("id", initialData.id).select("id").single()
      : await expensesTable.insert(insertPayload).select("id").single();

    setIsPending(false);

    if (response.error) {
      console.error("Erro ao salvar gasto:", response.error);
      toast.error(mapExpensesError(response.error.message));
      return;
    }

    toast.success(initialData ? "Gasto atualizado com sucesso." : "Gasto cadastrado com sucesso.");

    startTransition(() => {
      router.push("/expenses");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription>{initialData ? "Edição" : "Cadastro"}</CardDescription>
        <CardTitle>{initialData ? "Atualizar gasto" : "Registrar novo gasto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="rounded-[30px] border border-[rgba(138,105,47,0.12)] bg-[#faf7f0]/80 p-5">
              <div className="mb-5 space-y-1">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Detalhes do gasto
                </p>
                <p className="text-sm text-muted-foreground">Preencha os dados principais do gasto.</p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="expenseDate"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Data do gasto
                  </label>
                  <Input id="expenseDate" type="date" {...register("expenseDate")} />
                  {errors.expenseDate ? (
                    <p className="text-sm text-danger">{errors.expenseDate.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Descrição
                  </label>
                  <Input
                    id="description"
                    placeholder="Ex.: Compra de espuma D33"
                    {...register("description")}
                  />
                  {errors.description ? (
                    <p className="text-sm text-danger">{errors.description.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Categoria
                  </label>
                  <Input
                    id="category"
                    list="expense-categories"
                    placeholder="Selecione ou digite uma categoria"
                    {...register("category")}
                  />
                  <datalist id="expense-categories">
                    {EXPENSE_CATEGORIES.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="amount"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Valor
                  </label>
                  <Input id="amount" type="number" min="0" step="0.01" {...register("amount")} />
                  {errors.amount ? (
                    <p className="text-sm text-danger">{errors.amount.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="paymentMethod"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Forma de pagamento
                  </label>
                  <Select id="paymentMethod" {...register("paymentMethod")}>
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {PAYMENT_METHOD_LABELS[method]}
                      </option>
                    ))}
                  </Select>
                </div>

                {paymentMethod === "credit_card" ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="installments"
                      className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                    >
                      Parcelamento
                    </label>
                    <Select id="installments" {...register("installments")}>
                      {Array.from({ length: CREDIT_CARD_MAX_INSTALLMENTS }, (_, index) => {
                        const currentInstallment = index + 1;

                        return (
                          <option key={currentInstallment} value={currentInstallment}>
                            {currentInstallment}x
                          </option>
                        );
                      })}
                    </Select>
                    {errors.installments ? (
                      <p className="text-sm text-danger">{errors.installments.message}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[30px] border border-[rgba(138,105,47,0.12)] bg-[#faf7f0]/80 p-5">
              <div className="mb-5 space-y-1">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Observações
                </p>
                <p className="text-sm text-muted-foreground">Campo opcional para detalhar o gasto.</p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="notes"
                  className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Observações
                </label>
                <Textarea
                  id="notes"
                  placeholder="Fornecedor, número da nota, motivo do gasto"
                  {...register("notes")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
            <div className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(199,166,98,0.2),transparent_38%),linear-gradient(145deg,#202020,#101010)] p-6 text-white shadow-float">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#e0bf79]">
                Resumo do gasto
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Valor que será somado aos gastos do período.
              </p>
              <p className="mt-6 font-display text-[3.2rem] leading-none">
                {formatCurrencyBRL(Number(amount) || 0)}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[24px] bg-white/[0.08] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pagamento</p>
                  <p className="mt-2 text-xl font-semibold">
                    {formatPaymentDetails(
                      paymentMethod as ExpensePaymentMethod,
                      paymentMethod === "credit_card" ? Number(installments) || 1 : null
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-[rgba(138,105,47,0.12)] bg-white/90 p-5 shadow-soft">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Validação
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>O valor precisa ser maior que zero.</li>
                <li>Cartão de crédito permite parcelamento de 1x até 5x.</li>
                <li>Todo gasto registrado entra no cálculo do lucro real.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Salvando..." : initialData ? "Salvar alterações" : "Cadastrar gasto"}
              </Button>
              <Link href="/expenses" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
