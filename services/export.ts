import { formatDateBR, formatPaymentDetails } from "@/lib/utils";
import type { SaleRecord } from "@/types/sales";

const CSV_HEADERS = [
  "Data",
  "Produto",
  "Categoria",
  "Quantidade",
  "Valor unitário",
  "Valor total",
  "Forma de pagamento",
  "Parcelas",
  "Status",
  "Cliente",
  "Pedido",
  "Observações"
];

function escapeCsvCell(value: string | number | null | undefined) {
  const safeValue = value == null ? "" : String(value);
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function buildSalesCsv(sales: SaleRecord[]) {
  const rows = sales.map((sale) =>
    [
      formatDateBR(sale.sale_date),
      sale.product_name,
      sale.product_category ?? "",
      sale.quantity,
      Number(sale.unit_price).toFixed(2),
      Number(sale.total_price).toFixed(2),
      formatPaymentDetails(sale.payment_method, sale.installments),
      sale.installments ?? "",
      sale.status,
      sale.customer_name ?? "",
      sale.order_code ?? "",
      sale.notes ?? ""
    ]
      .map((cell) => escapeCsvCell(cell))
      .join(",")
  );

  return [CSV_HEADERS.join(","), ...rows].join("\n");
}
