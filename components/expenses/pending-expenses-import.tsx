"use client";

import { CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatCurrencyBRL } from "@/lib/utils";
import type { ExpenseInsert } from "@/types/expenses";

const IMPORT_PREFIX = "LOTE-GASTOS-OUT-2026";

const expensesToImport = [
  {
    expenseDate: "2026-10-09",
    description: "Pedágio",
    category: "Variável",
    amount: 20
  },
  {
    expenseDate: "2026-10-09",
    description: "Gasolina da van",
    category: "Variável",
    amount: 108
  },
  {
    expenseDate: "2026-10-09",
    description: "Reconhecimento de firma",
    category: "Outros",
    amount: 15
  },
  {
    expenseDate: "2026-10-09",
    description: "Ferramentas de IA",
    category: "Fixo",
    amount: 175
  },
  {
    expenseDate: "2026-10-02",
    description: "Compra na Master Comfort",
    category: "Matéria-prima",
    amount: 800
  },
  {
    expenseDate: "2026-10-05",
    description: "Compra na Master Comfort",
    category: "Matéria-prima",
    amount: 975
  },
  {
    expenseDate: "2026-10-07",
    description: "Compra na Master Comfort",
    category: "Matéria-prima",
    amount: 1225
  },
  {
    expenseDate: "2026-10-08",
    description: "Compra na Master Comfort",
    category: "Matéria-prima",
    amount: 925
  },
  {
    expenseDate: "2026-10-09",
    description: "Pagamento para Sebastião Correia da Silva",
    category: "Outros",
    amount: 200
  }
] as const;

const importTotal = expensesToImport.reduce((total, expense) => total + expense.amount, 0);
const importMarkers = expensesToImport.map(
  (_, index) => `${IMPORT_PREFIX}-${String(index + 1).padStart(2, "0")}`
);

export function PendingExpensesImport() {
  const router = useRouter();
  const [isImporting, setIsImporting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function checkImportStatus() {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("expenses")
        .select("notes")
        .in("notes", importMarkers);

      if (isActive) {
        if (!error) {
          const existingMarkers = new Set(
            ((data ?? []) as Array<{ notes: string | null }>)
              .map((expense) => expense.notes)
              .filter(Boolean)
          );
          setIsComplete(importMarkers.every((marker) => existingMarkers.has(marker)));
        }

        setIsChecking(false);
      }
    }

    void checkImportStatus();

    return () => {
      isActive = false;
    };
  }, []);

  const handleImport = async () => {
    const supabase = createBrowserSupabaseClient();
    setIsImporting(true);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsImporting(false);
      toast.error("Sua sessão expirou. Entre novamente para importar os gastos.");
      return;
    }

    const { data: existingExpenses, error: lookupError } = await supabase
      .from("expenses")
      .select("notes")
      .in("notes", importMarkers);

    if (lookupError) {
      setIsImporting(false);
      toast.error("Não foi possível verificar os gastos já importados.");
      return;
    }

    const existingMarkers = new Set(
      ((existingExpenses ?? []) as Array<{ notes: string | null }>)
        .map((expense) => expense.notes)
        .filter(Boolean)
    );
    const pendingRows: ExpenseInsert[] = expensesToImport.flatMap((expense, index) => {
      const importMarker = importMarkers[index];

      if (existingMarkers.has(importMarker)) {
        return [];
      }

      return [
        {
          expense_date: expense.expenseDate,
          description: expense.description,
          category: expense.category,
          amount: expense.amount,
          payment_method: "pix",
          installments: null,
          notes: importMarker,
          user_id: user.id
        }
      ];
    });

    if (!pendingRows.length) {
      setIsImporting(false);
      setIsComplete(true);
      toast.info("Os 9 gastos deste lote já foram importados.");
      return;
    }

    const expensesTable = supabase.from("expenses") as unknown as {
      insert: (rows: ExpenseInsert[]) => Promise<{ error: { message: string } | null }>;
    };
    const { error: insertError } = await expensesTable.insert(pendingRows);
    setIsImporting(false);

    if (insertError) {
      console.error("Erro ao importar gastos:", insertError);
      toast.error("Não foi possível importar os gastos. Tente novamente.");
      return;
    }

    setIsComplete(true);
    toast.success(
      `${pendingRows.length} ${pendingRows.length === 1 ? "gasto importado" : "gastos importados"} com sucesso.`
    );

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Card className="border-[rgba(138,105,47,0.24)] bg-[linear-gradient(135deg,#fffdf8,#f7efe0)]">
      <CardHeader className="pb-4">
        <CardDescription>Importação preparada</CardDescription>
        <CardTitle>9 gastos de outubro de 2026</CardTitle>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Total de {formatCurrencyBRL(importTotal)}, com datas conforme as informações e os comprovantes,
          pagamento via Pix e categorias organizadas por tipo de gasto.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {isComplete
            ? "Este lote já foi importado e não será duplicado."
            : "O sistema verifica o lote antes de salvar para evitar registros duplicados."}
        </p>
        <Button
          onClick={handleImport}
          disabled={isChecking || isImporting || isComplete}
          className="w-full sm:w-auto"
        >
          {isComplete ? <CheckCircle2 size={17} /> : <Download size={17} />}
          {isChecking
            ? "Verificando..."
            : isImporting
              ? "Importando..."
              : isComplete
                ? "Lote já importado"
                : "Importar 9 gastos"}
        </Button>
      </CardContent>
    </Card>
  );
}
