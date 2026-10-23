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

const importMarkers = expensesToImport.map(
  (_, index) => `${IMPORT_PREFIX}-${String(index + 1).padStart(2, "0")}`
);

const october23ExpensesToImport = [
  {
    "expenseDate": "2026-10-23",
    "description": "Combustível da van",
    "category": "Variável",
    "amount": 200
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Cola para emendar espumas",
    "category": "Matéria-prima",
    "amount": 290
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Documento da van",
    "category": "Outros",
    "amount": 390
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Vistoria para transferência da van",
    "category": "Outros",
    "amount": 200
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Taxas de cartão e parcelamentos (valor aproximado)",
    "category": "Variável",
    "amount": 500
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Separadores (anotação original: 4/10)",
    "category": "Matéria-prima",
    "amount": 1000
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Separadores",
    "category": "Matéria-prima",
    "amount": 500
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Ricardo - 3 viagens",
    "category": "Variável",
    "amount": 600
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Percinta elástica",
    "category": "Matéria-prima",
    "amount": 770
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Gasolina",
    "category": "Variável",
    "amount": 100
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Retrovisor da van",
    "category": "Variável",
    "amount": 60
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Gasolina",
    "category": "Variável",
    "amount": 50
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Cortador de espuma - Mandaguari",
    "category": "Outros",
    "amount": 50
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Ricardo - 2 viagens de frete",
    "category": "Variável",
    "amount": 400
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Separadores - Elexandro",
    "category": "Matéria-prima",
    "amount": 600
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Separadores - Elexandro",
    "category": "Matéria-prima",
    "amount": 600
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Separadores - Sebastião",
    "category": "Matéria-prima",
    "amount": 150
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Espumas",
    "category": "Matéria-prima",
    "amount": 780
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Separadores de espumas - Elexandro",
    "category": "Matéria-prima",
    "amount": 200
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Sebastião",
    "category": "Outros",
    "amount": 159
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Ronivaldo - laminador de espumas que trabalha para Ricardo",
    "category": "Outros",
    "amount": 265
  },
  {
    "expenseDate": "2026-10-16",
    "description": "Espumas - Master Comfort",
    "category": "Matéria-prima",
    "amount": 625
  },
  {
    "expenseDate": "2026-10-20",
    "description": "Espumas - Master Comfort",
    "category": "Matéria-prima",
    "amount": 1225
  },
  {
    "expenseDate": "2026-10-21",
    "description": "Gasto da van",
    "category": "Variável",
    "amount": 250
  },
  {
    "expenseDate": "2026-10-22",
    "description": "Espumas - Master Comfort",
    "category": "Matéria-prima",
    "amount": 1400
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Espumas - Master Comfort",
    "category": "Matéria-prima",
    "amount": 1100
  },
  {
    "expenseDate": "2026-10-23",
    "description": "Espumas - Master Comfort",
    "category": "Matéria-prima",
    "amount": 1400
  }
] as const;

const october23ImportMarkers = october23ExpensesToImport.map(
  (_, index) => `LOTE-GASTOS-2026-10-23-${String(index + 1).padStart(2, "0")}`
);

type ImportExpense = {
  expenseDate: string;
  description: string;
  category: string;
  amount: number;
};

function ExpenseBatchCard({ expensesToImport, importMarkers, title, description }: {
  expensesToImport: readonly ImportExpense[];
  importMarkers: string[];
  title: string;
  description: string;
}) {
  const importTotal = expensesToImport.reduce((total, expense) => total + expense.amount, 0);
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
  }, [importMarkers]);

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
      toast.info(`Os ${expensesToImport.length} gastos deste lote já foram importados.`);
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
        <CardTitle>{title}</CardTitle>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Total de {formatCurrencyBRL(importTotal)}. {description}
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
                : `Importar ${expensesToImport.length} gastos`}
        </Button>
      </CardContent>
    </Card>
  );
}

export function PendingExpensesImport() {
  return (
    <div className="space-y-4">
      <ExpenseBatchCard
        expensesToImport={october23ExpensesToImport}
        importMarkers={october23ImportMarkers}
        title="27 gastos do lote de 23/10/2026"
        description="Gastos por texto em 23/10 e comprovantes nas respectivas datas, pagamento via Pix. Inclui duas saídas de R$ 600 para Elexandro e R$ 500 aproximados de taxas. A anotação 4/10 foi preservada na descrição dos separadores."
      />
      <ExpenseBatchCard
        expensesToImport={expensesToImport}
        importMarkers={importMarkers}
        title="9 gastos de outubro de 2026"
        description="Datas conforme as informações e os comprovantes, pagamento via Pix e categorias organizadas por tipo de gasto."
      />
    </div>
  );
}
