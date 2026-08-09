import { notFound } from "next/navigation";

import { ExpensesForm } from "@/components/expenses/expenses-form";
import { PageHeader } from "@/components/ui/page-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getExpenseById } from "@/services/expenses";

export default async function EditExpensePage({
  params
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();
  const expense = await getExpenseById(supabase, params.id);

  if (!expense) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Edição"
        title="Editar gasto"
        description="Atualize os dados do gasto mantendo os cálculos consistentes."
      />
      <ExpensesForm initialData={expense} />
    </div>
  );
}
