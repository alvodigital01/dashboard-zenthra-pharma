import { DEFAULT_PAGE_SIZE, FILTER_PERIODS } from "@/lib/constants";
import type { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ExpenseRecord, ExpensesFilters, ExpensesPageData, ExpensesReportsData } from "@/types/expenses";
import { getCurrentMonthRange, getCurrentWeekRange, resolveDateRange, formatDateInput } from "@/utils/date";
import {
  buildDashboardExpenseMetrics,
  calculateExpenseSummaryMetrics,
  groupExpensesByMonth,
  groupExpensesByWeek
} from "@/utils/expenses";

type TypedSupabaseClient = ReturnType<typeof createServerSupabaseClient>;

function isFilterPeriod(value: string): value is ExpensesFilters["period"] {
  return FILTER_PERIODS.includes(value as ExpensesFilters["period"]);
}

function applyExpensesFilters(query: any, filters: ExpensesFilters) {
  let scopedQuery = query;

  if (filters.search) {
    scopedQuery = scopedQuery.ilike("description", `%${filters.search}%`);
  }

  if (filters.category) {
    scopedQuery = scopedQuery.eq("category", filters.category);
  }

  const range = resolveDateRange(filters.period, filters.dateFrom, filters.dateTo);

  if (range) {
    scopedQuery = scopedQuery
      .gte("expense_date", formatDateInput(range.from))
      .lte("expense_date", formatDateInput(range.to));
  }

  return scopedQuery;
}

export function normalizeExpensesFilters(
  input: Record<string, string | string[] | undefined>,
  overrides?: Partial<ExpensesFilters>
): ExpensesFilters {
  const getValue = (key: string) => {
    const value = input[key];
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  };

  const page = Number.parseInt(getValue("page"), 10);
  const periodValue = getValue("period");

  return {
    page: Number.isNaN(page) || page < 1 ? 1 : page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: getValue("search"),
    category: getValue("category"),
    period: isFilterPeriod(periodValue) ? periodValue : "all",
    dateFrom: getValue("dateFrom"),
    dateTo: getValue("dateTo"),
    ...overrides
  };
}

export async function getExpenseCategoryOptions(client: TypedSupabaseClient) {
  const { data, error } = await client.from("expenses").select("category").order("category");

  if (error) {
    throw new Error(error.message);
  }

  const categoryRows = (data ?? []) as Array<{ category: string | null }>;

  return Array.from(new Set(categoryRows.map((entry) => entry.category).filter(Boolean))) as string[];
}

export async function getDashboardExpenses(client: TypedSupabaseClient) {
  const weekRange = getCurrentWeekRange();
  const monthRange = getCurrentMonthRange();
  const rangeStart = weekRange.from < monthRange.from ? weekRange.from : monthRange.from;
  const rangeEnd = monthRange.to > weekRange.to ? monthRange.to : weekRange.to;

  const { data, error } = await client
    .from("expenses")
    .select("*")
    .gte("expense_date", formatDateInput(rangeStart))
    .lte("expense_date", formatDateInput(rangeEnd))
    .order("expense_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return buildDashboardExpenseMetrics((data ?? []) as ExpenseRecord[]);
}

export async function getExpensesPageData(
  client: TypedSupabaseClient,
  rawFilters: Record<string, string | string[] | undefined>
): Promise<ExpensesPageData> {
  const filters = normalizeExpensesFilters(rawFilters);
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;

  const query = applyExpensesFilters(client.from("expenses").select("*", { count: "exact" }), filters);
  const [{ data, count, error }, categoryOptions] = await Promise.all([
    query.order("expense_date", { ascending: false }).order("created_at", { ascending: false }).range(from, to),
    getExpenseCategoryOptions(client)
  ]);

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count ?? 0;

  return {
    expenses: (data ?? []) as ExpenseRecord[],
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / filters.pageSize)),
    categoryOptions,
    filters
  };
}

export async function getExpensesForPeriod(
  client: TypedSupabaseClient,
  period: ExpensesFilters["period"],
  dateFrom?: string,
  dateTo?: string
): Promise<ExpensesReportsData> {
  const range = resolveDateRange(period, dateFrom, dateTo);
  let query: any = client.from("expenses").select("*");

  if (range) {
    query = query
      .gte("expense_date", formatDateInput(range.from))
      .lte("expense_date", formatDateInput(range.to));
  }

  const { data, error } = await query.order("expense_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const expenses = (data ?? []) as ExpenseRecord[];

  return {
    expenses,
    summary: calculateExpenseSummaryMetrics(expenses),
    weeklyRows: groupExpensesByWeek(expenses),
    monthlyRows: groupExpensesByMonth(expenses)
  };
}

export async function getExpenseById(client: TypedSupabaseClient, expenseId: string) {
  const { data, error } = await client.from("expenses").select("*").eq("id", expenseId).single();

  if (error) {
    return null;
  }

  return data as ExpenseRecord;
}
