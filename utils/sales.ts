import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  VALID_CALCULATION_STATUSES,
  WEEK_STARTS_ON
} from "@/lib/constants";
import type { DashboardMetrics, PeriodSummaryRow, SaleRecord, SummaryMetrics } from "@/types/sales";
import { getCurrentMonthRange, getCurrentWeekRange, type DateRange } from "@/utils/date";

function getSaleDate(sale: SaleRecord) {
  return parseISO(sale.sale_date);
}

export function isValidSaleForMetrics(sale: SaleRecord) {
  return VALID_CALCULATION_STATUSES.includes(
    sale.status as (typeof VALID_CALCULATION_STATUSES)[number]
  );
}

export function getValidSales(sales: SaleRecord[]) {
  return sales.filter(isValidSaleForMetrics);
}

export function filterSalesByRange(sales: SaleRecord[], range: DateRange) {
  return sales.filter((sale) =>
    isWithinInterval(getSaleDate(sale), {
      start: range.from,
      end: range.to
    })
  );
}

export function calculateTotalProductsSold(sales: SaleRecord[]) {
  return getValidSales(sales).reduce((acc, sale) => acc + sale.quantity, 0);
}

export function calculateRevenue(sales: SaleRecord[]) {
  return getValidSales(sales).reduce((acc, sale) => acc + Number(sale.total_price), 0);
}

export function calculateAverageTicket(sales: SaleRecord[]) {
  const validSales = getValidSales(sales);
  if (!validSales.length) {
    return 0;
  }

  return calculateRevenue(validSales) / validSales.length;
}

export function calculateSummaryMetrics(sales: SaleRecord[]): SummaryMetrics {
  return {
    totalQuantity: calculateTotalProductsSold(sales),
    totalRevenue: calculateRevenue(sales),
    salesCount: sales.length,
    averageTicket: calculateAverageTicket(sales)
  };
}

export function groupSalesByDay(sales: SaleRecord[], range: DateRange) {
  const validSales = getValidSales(sales);

  return eachDayOfInterval({ start: range.from, end: range.to }).map((date) => {
    const dailySales = validSales.filter((sale) => {
      return format(getSaleDate(sale), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    });

    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "EEE", { locale: ptBR }),
      quantity: dailySales.reduce((acc, sale) => acc + sale.quantity, 0),
      revenue: dailySales.reduce((acc, sale) => acc + Number(sale.total_price), 0)
    };
  });
}

export function getTopProducts(sales: SaleRecord[], limit = 5) {
  const products = new Map<string, { quantity: number; revenue: number }>();

  getValidSales(sales).forEach((sale) => {
    const current = products.get(sale.product_name) ?? { quantity: 0, revenue: 0 };
    current.quantity += sale.quantity;
    current.revenue += Number(sale.total_price);
    products.set(sale.product_name, current);
  });

  return Array.from(products.entries())
    .map(([productName, values]) => ({
      productName,
      quantity: values.quantity,
      revenue: values.revenue
    }))
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, limit);
}

export function groupSalesByWeek(sales: SaleRecord[]) {
  const grouped = new Map<string, SaleRecord[]>();

  sales.forEach((sale) => {
    const key = format(
      startOfWeek(getSaleDate(sale), { weekStartsOn: WEEK_STARTS_ON }),
      "yyyy-MM-dd"
    );
    const current = grouped.get(key) ?? [];
    current.push(sale);
    grouped.set(key, current);
  });

  return Array.from(grouped.entries())
    .map(([periodKey, weekSales]) => {
      const validSales = getValidSales(weekSales);
      const summary = calculateSummaryMetrics(validSales);

      return {
        periodKey,
        label: `Semana de ${format(parseISO(periodKey), "dd/MM", { locale: ptBR })}`,
        totalQuantity: summary.totalQuantity,
        totalRevenue: summary.totalRevenue,
        salesCount: weekSales.length
      } satisfies PeriodSummaryRow;
    })
    .sort((left, right) => right.periodKey.localeCompare(left.periodKey));
}

export function groupSalesByMonth(sales: SaleRecord[]) {
  const grouped = new Map<string, SaleRecord[]>();

  sales.forEach((sale) => {
    const key = format(startOfMonth(getSaleDate(sale)), "yyyy-MM-dd");
    const current = grouped.get(key) ?? [];
    current.push(sale);
    grouped.set(key, current);
  });

  return Array.from(grouped.entries())
    .map(([periodKey, monthSales]) => {
      const validSales = getValidSales(monthSales);
      const summary = calculateSummaryMetrics(validSales);

      return {
        periodKey,
        label: format(parseISO(periodKey), "MMMM yyyy", { locale: ptBR }),
        totalQuantity: summary.totalQuantity,
        totalRevenue: summary.totalRevenue,
        salesCount: monthSales.length
      } satisfies PeriodSummaryRow;
    })
    .sort((left, right) => right.periodKey.localeCompare(left.periodKey));
}

export function buildDashboardMetrics(sales: SaleRecord[], reference = new Date()): DashboardMetrics {
  const weekRange = getCurrentWeekRange(reference);
  const monthRange = getCurrentMonthRange(reference);

  const weekSales = filterSalesByRange(sales, weekRange);
  const monthSales = filterSalesByRange(sales, monthRange);

  return {
    week: {
      ...calculateSummaryMetrics(weekSales)
    },
    month: calculateSummaryMetrics(monthSales),
    dailyWeekSales: groupSalesByDay(weekSales, weekRange),
    revenueTrend: groupSalesByDay(monthSales, {
      from: monthRange.from,
      to: endOfMonth(reference)
    }).map(({ date, label, revenue }) => ({
      date,
      label,
      revenue
    })),
    topProducts: getTopProducts(monthSales),
    recentSales: [...sales]
      .sort((left, right) => {
        const leftTimestamp = new Date(`${left.sale_date}T00:00:00`).getTime();
        const rightTimestamp = new Date(`${right.sale_date}T00:00:00`).getTime();

        if (leftTimestamp === rightTimestamp) {
          return right.created_at.localeCompare(left.created_at);
        }

        return rightTimestamp - leftTimestamp;
      })
      .slice(0, 6)
  };
}
