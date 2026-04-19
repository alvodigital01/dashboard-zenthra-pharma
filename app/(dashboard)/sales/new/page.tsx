import { SalesForm } from "@/components/sales/sales-form";
import { PageHeader } from "@/components/ui/page-header";

export default function NewSalePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cadastro"
        title="Nova venda"
        description="Preencha os dados da venda. O valor total será calculado automaticamente."
      />
      <SalesForm />
    </div>
  );
}
