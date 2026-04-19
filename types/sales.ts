import { FILTER_PERIODS, SALE_STATUSES } from "@/lib/constants";
import type { Database } from "@/types/database";

export type SaleRecord = Database["public"]["Tables"]["sales"]["Row"];
export type SaleInsert = Database["public"]["Tables"]["sales"]["Insert"];
export type SaleUpdate = Database["public"]["Tables"]["sales"]["Update"];
export type SaleStatus = (typeof SALE_STATUSES)[number];
export type FilterPeriod = (typeof FILTER_PERIODS)[number];

export interface SalesFilters {
  page: number;
  pageSize: number;
  search: string;
  product: string;
  status: SaleStatus | "all";
  period: FilterPeriod;
  dateFrom: string;
  dateTo: string;
}

export interface SalesPageData {
  sales: SaleRecord[];
  totalCount: number;
  totalPages: number;
  productOptions: string[];
  filters: SalesFilters;
}

export interface SummaryMetrics {
  totalQuantity: number;
  totalRevenue: number;
  salesCount: number;
  averageTicket: number;
}

export interface DashboardMetrics {
  week: SummaryMetrics;
  month: SummaryMetrics;
  dailyWeekSales: Array<{
    date: string;
    label: string;
    quantity: number;
    revenue: number;
  }>;
  revenueTrend: Array<{
    date: string;
    label: string;
    revenue: number;
  }>;
  topProducts: Array<{
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  recentSales: SaleRecord[];
}

export interface PeriodSummaryRow {
  periodKey: string;
  label: string;
  totalQuantity: number;
  totalRevenue: number;
  salesCount: number;
}

export interface ReportsData {
  sales: SaleRecord[];
  filters: SalesFilters;
  summary: SummaryMetrics;
  weeklyRows: PeriodSummaryRow[];
  monthlyRows: PeriodSummaryRow[];
}
