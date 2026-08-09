import { eachDayOfInterval, format, isWithinInterval, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

import { WEEK_STARTS_ON } from "@/lib/constants";
import type {
  DashboardExpenseMetrics,
  ExpensePeriodSummaryRow,
  ExpenseRecord,
  ExpenseSummaryMetrics
} from "@/types/expenses";
import { getCurrentMonthRange, getCurrentWeekRange, type DateRange } from "@/utils/date";

function getExpenseDate(expense: ExpenseRecord) {
  return parseISO(expense.expense_date);
}

export function filterExpensesByRange(expenses: ExpenseRecord[], range: DateRange) {
  return expenses.filter((expense) =>
    isWithinInterval(getExpenseDate(expense), {
      start: range.from,
      end: range.to
    })
  );
}

export function calculateTotalExpenses(expenses: ExpenseRecord[]) {
  return expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
}

export function calculateAverageExpense(expenses: ExpenseRecord[]) {
  if (!expenses.length) {
    return 0;
  }

  return calculateTotalExpenses(expenses) / expenses.length;
}

export function calculateExpenseSummaryMetrics(expenses: ExpenseRecord[]): ExpenseSummaryMetrics {
  return {
    totalAmount: calculateTotalExpenses(expenses),
    expensesCount: expenses.length,
    averageExpense: calculateAverageExpense(expenses)
  };
}

export function groupExpensesByDay(expenses: ExpenseRecord[], range: DateRange) {
  return eachDayOfInterval({ start: range.from, end: range.to }).map((date) => {
    const dailyExpenses = expenses.filter((expense) => {
      return format(getExpenseDate(expense), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    });

    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "EEE", { locale: ptBR }),
      amount: dailyExpenses.reduce((acc, expense) => acc + Number(expense.amount), 0)
    };
  });
}

export function groupExpensesByWeek(expenses: ExpenseRecord[]) {
  const grouped = new Map<string, ExpenseRecord[]>();

  expenses.forEach((expense) => {
    const key = format(
      startOfWeek(getExpenseDate(expense), { weekStartsOn: WEEK_STARTS_ON }),
      "yyyy-MM-dd"
    );
    const current = grouped.get(key) ?? [];
    current.push(expense);
    grouped.set(key, current);
  });

  return Array.from(grouped.entries())
    .map(([periodKey, weekExpenses]) => {
      const summary = calculateExpenseSummaryMetrics(weekExpenses);

      return {
        periodKey,
        label: `Semana de ${format(parseISO(periodKey), "dd/MM", { locale: ptBR })}`,
        totalAmount: summary.totalAmount,
        expensesCount: weekExpenses.length
      } satisfies ExpensePeriodSummaryRow;
    })
    .sort((left, right) => right.periodKey.localeCompare(left.periodKey));
}

export function groupExpensesByMonth(expenses: ExpenseRecord[]) {
  const grouped = new Map<string, ExpenseRecord[]>();

  expenses.forEach((expense) => {
    const key = format(startOfMonth(getExpenseDate(expense)), "yyyy-MM-dd");
    const current = grouped.get(key) ?? [];
    current.push(expense);
    grouped.set(key, current);
  });

  return Array.from(grouped.entries())
    .map(([periodKey, monthExpenses]) => {
      const summary = calculateExpenseSummaryMetrics(monthExpenses);

      return {
        periodKey,
        label: format(parseISO(periodKey), "MMMM yyyy", { locale: ptBR }),
        totalAmount: summary.totalAmount,
        expensesCount: monthExpenses.length
      } satisfies ExpensePeriodSummaryRow;
    })
    .sort((left, right) => right.periodKey.localeCompare(left.periodKey));
}

export function buildDashboardExpenseMetrics(
  expenses: ExpenseRecord[],
  reference = new Date()
): DashboardExpenseMetrics {
  const weekRange = getCurrentWeekRange(reference);
  const monthRange = getCurrentMonthRange(reference);

  return {
    week: calculateExpenseSummaryMetrics(filterExpensesByRange(expenses, weekRange)),
    month: calculateExpenseSummaryMetrics(filterExpensesByRange(expenses, monthRange))
  };
}
