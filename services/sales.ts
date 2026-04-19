import { DEFAULT_PAGE_SIZE, FILTER_PERIODS, SALE_STATUSES } from "@/lib/constants";
import type { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ReportsData, SaleRecord, SalesFilters, SalesPageData } from "@/types/sales";
import { getCurrentMonthRange, getCurrentWeekRange, resolveDateRange, formatDateInput } from "@/utils/date";
import {
  buildDashboardMetrics,
  calculateSummaryMetrics,
  calculateTotalProductsSold,
  filterSalesByRange,
  groupSalesByMonth,
  groupSalesByWeek
} from "@/utils/sales";

type TypedSupabaseClient = ReturnType<typeof createServerSupabaseClient>;

function isSaleStatus(value: string): value is SaleRecord["status"] {
  return SALE_STATUSES.includes(value as SaleRecord["status"]);
}

function isFilterPeriod(value: string): value is SalesFilters["period"] {
  return FILTER_PERIODS.includes(value as SalesFilters["period"]);
}

function applySalesFilters(query: any, filters: SalesFilters) {
  let scopedQuery = query;

  if (filters.search) {
    scopedQuery = scopedQuery.ilike("product_name", `%${filters.search}%`);
  }

  if (filters.product) {
    scopedQuery = scopedQuery.eq("product_name", filters.product);
  }

  if (filters.status !== "all") {
    scopedQuery = scopedQuery.eq("status", filters.status);
  }

  const range = resolveDateRange(filters.period, filters.dateFrom, filters.dateTo);

  if (range) {
    scopedQuery = scopedQuery
      .gte("sale_date", formatDateInput(range.from))
      .lte("sale_date", formatDateInput(range.to));
  }

  return scopedQuery;
}

export function normalizeSalesFilters(
  input: Record<string, string | string[] | undefined>,
  overrides?: Partial<SalesFilters>
): SalesFilters {
  const getValue = (key: string) => {
    const value = input[key];
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  };

  const page = Number.parseInt(getValue("page"), 10);
  const periodValue = getValue("period");
  const statusValue = getValue("status");

  return {
    page: Number.isNaN(page) || page < 1 ? 1 : page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: getValue("search"),
    product: getValue("product"),
    status: statusValue === "all" ? "all" : isSaleStatus(statusValue) ? statusValue : "all",
    period: isFilterPeriod(periodValue) ? periodValue : "all",
    dateFrom: getValue("dateFrom"),
    dateTo: getValue("dateTo"),
    ...overrides
  };
}

export async function getProductOptions(client: TypedSupabaseClient) {
  const { data, error } = await client.from("sales").select("product_name").order("product_name");

  if (error) {
    throw new Error(error.message);
  }

  const productRows = (data ?? []) as Array<{ product_name: string }>;

  return Array.from(new Set(productRows.map((entry) => entry.product_name))).filter(Boolean);
}

export async function getDashboardData(client: TypedSupabaseClient) {
  const weekRange = getCurrentWeekRange();
  const monthRange = getCurrentMonthRange();
  const rangeStart = weekRange.from < monthRange.from ? weekRange.from : monthRange.from;
  const rangeEnd = monthRange.to > weekRange.to ? monthRange.to : weekRange.to;

  const { data, error } = await client
    .from("sales")
    .select("*")
    .gte("sale_date", formatDateInput(rangeStart))
    .lte("sale_date", formatDateInput(rangeEnd))
    .order("sale_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return buildDashboardMetrics((data ?? []) as SaleRecord[]);
}

export async function getSalesPageData(
  client: TypedSupabaseClient,
  rawFilters: Record<string, string | string[] | undefined>
): Promise<SalesPageData> {
  const filters = normalizeSalesFilters(rawFilters);
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;

  const query = applySalesFilters(client.from("sales").select("*", { count: "exact" }), filters);
  const [{ data, count, error }, productOptions] = await Promise.all([
    query
      .order("sale_date", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to),
    getProductOptions(client)
  ]);

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count ?? 0;

  return {
    sales: (data ?? []) as SaleRecord[],
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / filters.pageSize)),
    productOptions,
    filters
  };
}

export async function getSaleById(client: TypedSupabaseClient, saleId: string) {
  const { data, error } = await client.from("sales").select("*").eq("id", saleId).single();

  if (error) {
    return null;
  }

  return data as SaleRecord;
}

export async function getReportsData(
  client: TypedSupabaseClient,
  rawFilters: Record<string, string | string[] | undefined>
): Promise<ReportsData> {
  const filters = normalizeSalesFilters(rawFilters, {
    period:
      ((Array.isArray(rawFilters.period) ? rawFilters.period[0] : rawFilters.period) as
        | SalesFilters["period"]
        | undefined) ?? "thisMonth"
  });

  const query = applySalesFilters(client.from("sales").select("*"), filters).order("sale_date", {
    ascending: true
  });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const sales = (data ?? []) as SaleRecord[];
  const summary = calculateSummaryMetrics(sales);

  return {
    sales,
    filters,
    summary,
    weeklyRows: groupSalesByWeek(sales),
    monthlyRows: groupSalesByMonth(sales)
  };
}

export async function listSalesForExport(
  client: TypedSupabaseClient,
  rawFilters: Record<string, string | string[] | undefined>
) {
  const filters = normalizeSalesFilters(rawFilters);
  const query = applySalesFilters(client.from("sales").select("*"), filters)
    .order("sale_date", { ascending: false })
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SaleRecord[];
}

export async function getReportSnapshotForDashboard(client: TypedSupabaseClient) {
  const { data, error } = await client.from("sales").select("*").order("sale_date", {
    ascending: true
  });

  if (error) {
    throw new Error(error.message);
  }

  const sales = (data ?? []) as SaleRecord[];
  const weekSales = filterSalesByRange(sales, getCurrentWeekRange());
  const monthSales = filterSalesByRange(sales, getCurrentMonthRange());

  return {
    weekSummary: calculateSummaryMetrics(weekSales),
    monthSummary: calculateSummaryMetrics(monthSales),
    totalQuantity: calculateTotalProductsSold(sales)
  };
}
