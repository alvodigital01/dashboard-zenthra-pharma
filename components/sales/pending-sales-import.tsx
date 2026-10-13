"use client";

import { CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatCurrencyBRL } from "@/lib/utils";
import type { SaleInsert } from "@/types/sales";

type ImportSale = {
  customerName: string;
  unitPrice: number;
  saleDate: string;
};

type ImportBatch = {
  title: string;
  prefix: string;
  description: string;
  notes: string;
  sales: readonly ImportSale[];
};

const informedSalesBatch: ImportBatch = {
  title: "16 vendas de 13/10/2026",
  prefix: "LOTE-2026-10-13",
  description:
    "Categoria Espumas, status Pago, quantidade 1 e pagamento via Pix. As saídas e a venda sem valor não fazem parte deste lote.",
  notes: "Importação em lote das vendas informadas em 13/10/2026.",
  sales: [
    { customerName: "Beto Tapeçaria", unitPrice: 450, saleDate: "2026-10-13" },
    { customerName: "Marcos Tapeceiro", unitPrice: 160, saleDate: "2026-10-13" },
    { customerName: "Tapeçaria em Frente ao Campo", unitPrice: 100, saleDate: "2026-10-13" },
    { customerName: "DWR Tapeçaria", unitPrice: 350, saleDate: "2026-10-13" },
    { customerName: "Tapeçaria Iguaçu", unitPrice: 540, saleDate: "2026-10-13" },
    { customerName: "Tapeçaria Elshaday", unitPrice: 306, saleDate: "2026-10-13" },
    { customerName: "Tapeçaria 2 Irmãos", unitPrice: 80, saleDate: "2026-10-13" },
    { customerName: "Art Gold", unitPrice: 899, saleDate: "2026-10-13" },
    { customerName: "Vanderlei", unitPrice: 330, saleDate: "2026-10-13" },
    { customerName: "Leo Estofados", unitPrice: 750, saleDate: "2026-10-13" },
    { customerName: "Beto Tapeçaria", unitPrice: 198, saleDate: "2026-10-13" },
    { customerName: "Arnaldo", unitPrice: 68, saleDate: "2026-10-13" },
    { customerName: "Junior Soufa", unitPrice: 1350, saleDate: "2026-10-13" },
    { customerName: "Graciosa", unitPrice: 188, saleDate: "2026-10-13" },
    { customerName: "Art Gold", unitPrice: 1600, saleDate: "2026-10-13" },
    { customerName: "Prado", unitPrice: 720, saleDate: "2026-10-13" }
  ]
};

const receiptSalesBatch: ImportBatch = {
  title: "8 vendas dos comprovantes de outubro",
  prefix: "COMPROVANTES-OUT-2026",
  description:
    "Datas conforme os comprovantes, categoria Espumas, status Pago, quantidade 1 e pagamento via Pix.",
  notes: "Importação em lote a partir dos comprovantes de Pix de outubro de 2026.",
  sales: [
    { customerName: "Andreia Roque dos Santos", unitPrice: 320, saleDate: "2026-10-09" },
    { customerName: "Tapeçaria Rodricar Ltda", unitPrice: 238, saleDate: "2026-10-02" },
    {
      customerName: "Alessandra A. da Silva - Móveis e Decorações Ltda",
      unitPrice: 880,
      saleDate: "2026-10-08"
    },
    { customerName: "Ismael Ruiz", unitPrice: 96, saleDate: "2026-10-06" },
    { customerName: "José Junior Teixeira", unitPrice: 2000, saleDate: "2026-10-06" },
    { customerName: "Enio Rocha Viana", unitPrice: 100, saleDate: "2026-10-09" },
    { customerName: "C.L. Faria Estofados Ltda", unitPrice: 160, saleDate: "2026-10-03" },
    { customerName: "Agilenildo da Silva Brito", unitPrice: 350, saleDate: "2026-10-09" }
  ]
};

const additionalSalesBatch: ImportBatch = {
  title: "5 vendas adicionais de 13/10/2026",
  prefix: "LOTE-ADICIONAL-2026-10-13",
  description: "Categoria Espumas, status Pago, quantidade 1 e pagamento via Pix.",
  notes: "Importação em lote das vendas adicionais informadas em 13/10/2026.",
  sales: [
    { customerName: "Tapeçaria Arthur Tomas", unitPrice: 65, saleDate: "2026-10-13" },
    { customerName: "Vanderlei", unitPrice: 218, saleDate: "2026-10-13" },
    { customerName: "Tapeceiro Cambé", unitPrice: 250, saleDate: "2026-10-13" },
    { customerName: "Art Manhã Estofados", unitPrice: 140, saleDate: "2026-10-13" },
    { customerName: "Roberto Tapeçaria", unitPrice: 400, saleDate: "2026-10-13" }
  ]
};

function ImportBatchCard({ batch }: { batch: ImportBatch }) {
  const router = useRouter();
  const [isImporting, setIsImporting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const importTotal = batch.sales.reduce((total, sale) => total + sale.unitPrice, 0);

  const handleImport = async () => {
    const supabase = createBrowserSupabaseClient();
    setIsImporting(true);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsImporting(false);
      toast.error("Sua sessão expirou. Entre novamente para importar as vendas.");
      return;
    }

    const importCodes = batch.sales.map(
      (_, index) => `${batch.prefix}-${String(index + 1).padStart(2, "0")}`
    );
    const { data: existingSales, error: lookupError } = await supabase
      .from("sales")
      .select("order_code")
      .in("order_code", importCodes);

    if (lookupError) {
      setIsImporting(false);
      toast.error("Não foi possível verificar as vendas já importadas.");
      return;
    }

    const existingCodes = new Set(
      ((existingSales ?? []) as Array<{ order_code: string | null }>)
        .map((sale) => sale.order_code)
        .filter(Boolean)
    );
    const pendingRows: SaleInsert[] = batch.sales.flatMap((sale, index) => {
      const orderCode = importCodes[index];

      if (existingCodes.has(orderCode)) {
        return [];
      }

      return [
        {
          sale_date: sale.saleDate,
          product_name: "Espuma",
          product_category: "Espumas",
          quantity: 1,
          unit_price: sale.unitPrice,
          payment_method: "pix",
          installments: null,
          customer_name: sale.customerName,
          order_code: orderCode,
          status: "paid",
          notes: batch.notes,
          user_id: user.id
        }
      ];
    });

    if (!pendingRows.length) {
      setIsImporting(false);
      setIsComplete(true);
      toast.info(`As ${batch.sales.length} vendas deste lote já foram importadas.`);
      return;
    }

    const salesTable = supabase.from("sales") as unknown as {
      insert: (rows: SaleInsert[]) => Promise<{ error: { message: string } | null }>;
    };
    const { error: insertError } = await salesTable.insert(pendingRows);
    setIsImporting(false);

    if (insertError) {
      console.error("Erro ao importar vendas:", insertError);
      toast.error("Não foi possível importar as vendas. Tente novamente.");
      return;
    }

    setIsComplete(true);
    toast.success(
      `${pendingRows.length} ${pendingRows.length === 1 ? "venda importada" : "vendas importadas"} com sucesso.`
    );

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Card className="border-[rgba(138,105,47,0.24)] bg-[linear-gradient(135deg,#fffdf8,#f7efe0)]">
      <CardHeader className="pb-4">
        <CardDescription>Importação preparada</CardDescription>
        <CardTitle>{batch.title}</CardTitle>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Total de {formatCurrencyBRL(importTotal)}. {batch.description}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          O sistema verifica o lote antes de salvar para evitar registros duplicados.
        </p>
        <Button onClick={handleImport} disabled={isImporting || isComplete} className="w-full sm:w-auto">
          {isComplete ? <CheckCircle2 size={17} /> : <Download size={17} />}
          {isImporting
            ? "Importando..."
            : isComplete
              ? "Lote importado"
              : `Importar ${batch.sales.length} vendas`}
        </Button>
      </CardContent>
    </Card>
  );
}

export function PendingSalesImport() {
  return (
    <div className="space-y-4">
      <ImportBatchCard batch={additionalSalesBatch} />
      <ImportBatchCard batch={receiptSalesBatch} />
      <ImportBatchCard batch={informedSalesBatch} />
    </div>
  );
}
