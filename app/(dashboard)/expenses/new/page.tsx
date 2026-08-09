import { ExpensesForm } from "@/components/expenses/expenses-form";
import { PageHeader } from "@/components/ui/page-header";

export default function NewExpensePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cadastro"
        title="Novo gasto"
        description="Registre um gasto para acompanhar o lucro real."
      />
      <ExpensesForm />
    </div>
  );
}
