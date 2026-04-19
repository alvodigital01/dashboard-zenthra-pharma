import { NextResponse, type NextRequest } from "next/server";

import { hasSupabaseCredentials } from "@/lib/supabase/shared";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildSalesCsv } from "@/services/export";
import { listSalesForExport } from "@/services/sales";

export async function GET(request: NextRequest) {
  if (!hasSupabaseCredentials()) {
    return NextResponse.json(
      {
        message:
          "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
      },
      { status: 503 }
    );
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const queryEntries = Object.fromEntries(request.nextUrl.searchParams.entries());
  const sales = await listSalesForExport(supabase, queryEntries);
  const csv = buildSalesCsv(sales);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sales-export-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
