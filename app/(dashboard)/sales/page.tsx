import Link from "next/link";

import { Layers3, PackageSearch, Rows3 } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { FiltersBar } from "@/components/sales/filters-bar";
import { SalesTable } from "@/components/sales/sales-table";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSalesPageData } from "@/services/sales";

export default async function SalesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const supabase = createServerSupabaseClient();
  const data = await getSalesPageData(supabase, searchParams);

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        eyebrow="Operação"
        title="Vendas"
        description="Cadastre, filtre e acompanhe o histórico de vendas."
        action={
          <Link href="/sales/new" className={buttonVariants({ className: "w-full sm:w-auto" })}>
            Nova venda
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
        <MetricCard
          title="Registros encontrados"
          value={String(data.totalCount)}
          description="Vendas no filtro atual."
          icon={Rows3}
        />
        <MetricCard
          title="Produtos mapeados"
          value={String(data.productOptions.length)}
          description="Produtos disponíveis no filtro."
          icon={PackageSearch}
          tone="accent"
        />
        <MetricCard
          title="Itens nesta página"
          value={String(data.sales.length)}
          description="Registros exibidos nesta página."
          icon={Layers3}
          tone="success"
        />
      </div>

      <FiltersBar filters={data.filters} productOptions={data.productOptions} />
      <SalesTable sales={data.sales} />
      <Pagination
        currentPage={data.filters.page}
        totalPages={data.totalPages}
        filters={data.filters}
      />
    </div>
  );
}
