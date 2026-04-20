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
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS
} from "@/lib/constants";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatCurrencyBRL, formatNumber, formatPaymentDetails } from "@/lib/utils";
import type {
  PaymentMethod,
  SaleInsert,
  SaleRecord,
  SaleStatus,
  SaleUpdate
} from "@/types/sales";

const saleSchema = z
  .object({
    saleDate: z.string().min(1, "A data da venda é obrigatória."),
    productName: z.string().min(1, "O produto é obrigatório."),
    productCategory: z.string().optional(),
    quantity: z.coerce.number().int().positive("A quantidade deve ser maior que zero."),
    unitPrice: z.coerce.number().positive("O valor unitário deve ser maior que zero."),
    paymentMethod: z.enum(PAYMENT_METHODS),
    installments: z.coerce
      .number()
      .int()
      .min(1, "Escolha pelo menos 1 parcela.")
      .max(CREDIT_CARD_MAX_INSTALLMENTS, `Parcelamento limitado a ${CREDIT_CARD_MAX_INSTALLMENTS}x.`)
      .optional(),
    customerName: z.string().optional(),
    orderCode: z.string().optional(),
    status: z.enum(["pending", "paid", "completed", "cancelled"]),
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

type SaleFormValues = z.infer<typeof saleSchema>;

function sanitizeOptional(value?: string) {
  return value?.trim() ? value.trim() : null;
}

function mapSalesError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("row-level security")) {
    return "Sua sessão não tem permissão para salvar esta venda. Entre novamente e tente de novo.";
  }

  if (normalized.includes("violates foreign key constraint")) {
    return "Não foi possível vincular a venda ao usuário atual. Entre novamente e tente de novo.";
  }

  if (
    normalized.includes("payment_method") ||
    normalized.includes("installments") ||
    normalized.includes("schema cache")
  ) {
    return "O banco ainda não foi atualizado para forma de pagamento e parcelamento. Execute o SQL novo no Supabase e tente novamente.";
  }

  if (normalized.includes("violates check constraint")) {
    return "Revise quantidade, valor unitário, status e parcelamento antes de salvar.";
  }

  return "Não foi possível salvar a venda agora. Tente novamente.";
}

const saleStatusLabels: Record<SaleStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  completed: "Concluído",
  cancelled: "Cancelado"
};

export function SalesForm({
  initialData
}: {
  initialData?: SaleRecord | null;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      saleDate: initialData?.sale_date ?? new Date().toISOString().slice(0, 10),
      productName: initialData?.product_name ?? "",
      productCategory: initialData?.product_category ?? "",
      quantity: initialData?.quantity ?? 1,
      unitPrice: Number(initialData?.unit_price ?? 0),
      paymentMethod: initialData?.payment_method ?? "pix",
      installments: initialData?.installments ?? 1,
      customerName: initialData?.customer_name ?? "",
      orderCode: initialData?.order_code ?? "",
      status: initialData?.status ?? "pending",
      notes: initialData?.notes ?? ""
    }
  });

  const quantity = watch("quantity");
  const unitPrice = watch("unitPrice");
  const paymentMethod = watch("paymentMethod");
  const installments = watch("installments");
  const currentStatus = watch("status");
  const totalPrice = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  const onSubmit = async (values: SaleFormValues) => {
    const supabase = createBrowserSupabaseClient();
    setIsPending(true);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsPending(false);
      toast.error("Sua sessão expirou. Entre novamente para cadastrar a venda.");
      return;
    }

    const basePayload = {
      sale_date: values.saleDate,
      product_name: values.productName.trim(),
      product_category: sanitizeOptional(values.productCategory),
      quantity: values.quantity,
      unit_price: values.unitPrice,
      payment_method: values.paymentMethod as PaymentMethod,
      installments: values.paymentMethod === "credit_card" ? values.installments ?? 1 : null,
      customer_name: sanitizeOptional(values.customerName),
      order_code: sanitizeOptional(values.orderCode),
      status: values.status as SaleStatus,
      notes: sanitizeOptional(values.notes)
    };

    const insertPayload: SaleInsert = {
      ...basePayload,
      user_id: user.id
    };

    const updatePayload: SaleUpdate = basePayload;
    const salesTable = supabase.from("sales") as unknown as {
      insert: (payload: SaleInsert) => {
        select: (columns: string) => {
          single: () => Promise<{ error: { message: string } | null }>;
        };
      };
      update: (payload: SaleUpdate) => {
        eq: (column: "id", value: string) => {
          select: (columns: string) => {
            single: () => Promise<{ error: { message: string } | null }>;
          };
        };
      };
    };

    const response = initialData
      ? await salesTable.update(updatePayload).eq("id", initialData.id).select("id").single()
      : await salesTable.insert(insertPayload).select("id").single();

    setIsPending(false);

    if (response.error) {
      console.error("Erro ao salvar venda:", response.error);
      toast.error(mapSalesError(response.error.message));
      return;
    }

    toast.success(initialData ? "Venda atualizada com sucesso." : "Venda cadastrada com sucesso.");

    startTransition(() => {
      router.push("/sales");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription>{initialData ? "Edição" : "Cadastro"}</CardDescription>
        <CardTitle>{initialData ? "Atualizar venda" : "Registrar nova venda"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="rounded-[30px] border border-[rgba(16,46,94,0.08)] bg-slate-50/60 p-5">
              <div className="mb-5 space-y-1">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Detalhes da venda
                </p>
                <p className="text-sm text-muted-foreground">Preencha os dados principais da venda.</p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="saleDate"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Data da venda
                  </label>
                  <Input id="saleDate" type="date" {...register("saleDate")} />
                  {errors.saleDate ? (
                    <p className="text-sm text-danger">{errors.saleDate.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="productName"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Nome do produto
                  </label>
                  <Input
                    id="productName"
                    placeholder="Ex.: Amoxicilina 500mg"
                    {...register("productName")}
                  />
                  {errors.productName ? (
                    <p className="text-sm text-danger">{errors.productName.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="productCategory"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Categoria do produto
                  </label>
                  <Input id="productCategory" placeholder="Opcional" {...register("productCategory")} />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Status da venda
                  </label>
                  <Select id="status" {...register("status")}>
                    <option value="pending">Pendente</option>
                    <option value="paid">Pago</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="quantity"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Quantidade
                  </label>
                  <Input id="quantity" type="number" min="1" step="1" {...register("quantity")} />
                  {errors.quantity ? (
                    <p className="text-sm text-danger">{errors.quantity.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="unitPrice"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Valor unitário
                  </label>
                  <Input id="unitPrice" type="number" min="0" step="0.01" {...register("unitPrice")} />
                  {errors.unitPrice ? (
                    <p className="text-sm text-danger">{errors.unitPrice.message}</p>
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

            <div className="rounded-[30px] border border-[rgba(16,46,94,0.08)] bg-slate-50/60 p-5">
              <div className="mb-5 space-y-1">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Contexto comercial
                </p>
                <p className="text-sm text-muted-foreground">
                  Campos opcionais para cliente, pedido e observações.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="customerName"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Nome do cliente
                  </label>
                  <Input id="customerName" placeholder="Opcional" {...register("customerName")} />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="orderCode"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Pedido ou identificador
                  </label>
                  <Input id="orderCode" placeholder="Opcional" {...register("orderCode")} />
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <label
                    htmlFor="notes"
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
                  >
                    Observações
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Informações adicionais sobre a venda"
                    {...register("notes")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
            <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,rgba(9,25,55,1),rgba(12,45,93,1))] p-6 text-white shadow-float">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Resumo financeiro
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Total calculado por quantidade e valor unitário.
              </p>
              <p className="mt-6 font-display text-[3.2rem] leading-none">
                {formatCurrencyBRL(totalPrice)}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[24px] bg-white/[0.08] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Quantidade</p>
                  <p className="mt-2 text-xl font-semibold">{formatNumber(Number(quantity) || 0)}</p>
                </div>

                <div className="rounded-[24px] bg-white/[0.08] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pagamento</p>
                  <p className="mt-2 text-xl font-semibold">
                    {formatPaymentDetails(
                      paymentMethod as PaymentMethod,
                      paymentMethod === "credit_card" ? Number(installments) || 1 : null
                    )}
                  </p>
                </div>

                <div className="rounded-[24px] bg-white/[0.08] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status atual</p>
                  <p className="mt-2 text-xl font-semibold">
                    {saleStatusLabels[currentStatus as SaleStatus] ?? "Pendente"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-[rgba(16,46,94,0.08)] bg-white/90 p-5 shadow-soft">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Validação
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Quantidade precisa ser maior que zero.</li>
                <li>Valor unitário precisa ser maior que zero.</li>
                <li>Cartão de crédito permite parcelamento de 1x até 5x.</li>
                <li>Somente vendas pagas e concluídas entram nos indicadores.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Salvando..." : initialData ? "Salvar alterações" : "Cadastrar venda"}
              </Button>
              <Link href="/sales" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
