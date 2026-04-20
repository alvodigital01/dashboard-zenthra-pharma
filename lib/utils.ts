import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import type { PaymentMethod } from "@/types/sales";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatDateBR(value: string) {
  return format(parseISO(value), "dd/MM/yyyy", { locale: ptBR });
}

export function formatShortDate(value: string) {
  return format(parseISO(value), "dd MMM", { locale: ptBR });
}

export function formatMonthLabel(value: string) {
  return format(parseISO(value), "MMM/yyyy", { locale: ptBR });
}

export function formatPaymentDetails(
  paymentMethod?: PaymentMethod | null,
  installments?: number | null
) {
  if (!paymentMethod) {
    return "Pagamento não informado";
  }

  const baseLabel = PAYMENT_METHOD_LABELS[paymentMethod] ?? "Pagamento";

  if (paymentMethod === "credit_card") {
    return `${baseLabel} ${installments ?? 1}x`;
  }

  return baseLabel;
}

export function getInitials(value: string) {
  const source = value.split("@")[0] ?? value;
  return source
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function buildSearchParams(
  entries: Record<string, string | number | undefined | null>
) {
  const searchParams = new URLSearchParams();

  Object.entries(entries).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}
