"use client";

import { Download, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatCurrencyBRL } from "@/lib/utils";
import type { SaleInsert } from "@/types/sales";

const IMPORT_DATE = "2026-10-13";
const IMPORT_PREFIX = "LOTE-2026-10-13";

const salesToImport = [
  { customerName: "Beto Tapeçaria", unitPrice: 450 },
  { customerName: "Marcos Tapeceiro", unitPrice: 160 },
  { customerName: "Tapeçaria em Frente ao Campo", unitPrice: 100 },
  { customerName: "DWR Tapeçaria", unitPrice: 350 },
  { customerName: "Tapeçaria Iguaçu", unitPrice: 540 },
  { customerName: "Tapeçaria Elshaday", unitPrice: 306 },
  { customerName: "Tapeçaria 2 Irmãos", unitPrice: 80 },
  { customerName: "Art Gold", unitPrice: 899 },
  { customerName: "Vanderlei", unitPrice: 330 },
  { customerName: "Leo Estofados", unitPrice: 750 },
  { customerName: "Beto Tapeçaria", unitPrice: 198 },
  { customerName: "Arnaldo", unitPrice: 68 },
  { customerName: "Junior Soufa", unitPrice: 1350 },
  { customerName: "Graciosa", unitPrice: 188 },
  { customerName: "Art Gold", unitPrice: 1600 },
  { customerName: "Prado", unitPrice: 720 }
] as const;

const importTotal = salesToImport.reduce((total, sale) => total + sale.unitPrice, 0);

export function PendingSalesImport() {
  const router = useRouter();
  const [isImporting, setIsImporting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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

    const importCodes = salesToImport.map(
      (_, index) => `${IMPORT_PREFIX}-${String(index + 1).padStart(2, "0")}`
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
    const pendingRows: SaleInsert[] = salesToImport.flatMap((sale, index) => {
      const orderCode = importCodes[index];

      if (existingCodes.has(orderCode)) {
        return [];
      }

      return [
        {
          sale_date: IMPORT_DATE,
          product_name: "Espuma",
          product_category: "Espumas",
          quantity: 1,
          unit_price: sale.unitPrice,
          payment_method: "pix",
          installments: null,
          customer_name: sale.customerName,
          order_code: orderCode,
          status: "paid",
          notes: "Importação em lote das vendas informadas em 13/10/2026.",
          user_id: user.id
        }
      ];
    });

    if (!pendingRows.length) {
      setIsImporting(false);
      setIsComplete(true);
      toast.info("As 16 vendas deste lote já foram importadas.");
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
        <CardTitle>16 vendas de 13/10/2026</CardTitle>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Total de {formatCurrencyBRL(importTotal)}, com categoria Espumas, status Pago,
          quantidade 1 e pagamento via Pix. As saídas e a venda sem valor não fazem parte deste lote.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          O sistema verifica o lote antes de salvar para evitar registros duplicados.
        </p>
        <Button onClick={handleImport} disabled={isImporting || isComplete} className="w-full sm:w-auto">
          {isComplete ? <CheckCircle2 size={17} /> : <Download size={17} />}
          {isImporting ? "Importando..." : isComplete ? "Lote importado" : "Importar 16 vendas"}
        </Button>
      </CardContent>
    </Card>
  );
}
