import { notFound } from "next/navigation";

import { SalesForm } from "@/components/sales/sales-form";
import { PageHeader } from "@/components/ui/page-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSaleById } from "@/services/sales";

export default async function EditSalePage({
  params
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();
  const sale = await getSaleById(supabase, params.id);

  if (!sale) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Edição"
        title="Editar venda"
        description="Atualize os dados da venda mantendo os cálculos e validações consistentes."
      />
      <SalesForm initialData={sale} />
    </div>
  );
}
