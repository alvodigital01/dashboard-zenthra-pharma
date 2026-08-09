import type { FILTER_PERIODS, PAYMENT_METHODS } from "@/lib/constants";
import type { Database } from "@/types/database";

export type ExpenseRecord = Database["public"]["Tables"]["expenses"]["Row"];
export type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"];
export type ExpenseUpdate = Database["public"]["Tables"]["expenses"]["Update"];
export type ExpensePaymentMethod = (typeof PAYMENT_METHODS)[number];
export type ExpenseFilterPeriod = (typeof FILTER_PERIODS)[number];

export interface ExpensesFilters {
  page: number;
  pageSize: number;
  search: string;
  category: string;
  period: ExpenseFilterPeriod;
  dateFrom: string;
  dateTo: string;
}

export interface ExpensesPageData {
  expenses: ExpenseRecord[];
  totalCount: number;
  totalPages: number;
  categoryOptions: string[];
  filters: ExpensesFilters;
}

export interface ExpenseSummaryMetrics {
  totalAmount: number;
  expensesCount: number;
  averageExpense: number;
}

export interface DashboardExpenseMetrics {
  week: ExpenseSummaryMetrics;
  month: ExpenseSummaryMetrics;
}
