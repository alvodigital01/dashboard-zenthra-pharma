import { isWithinInterval, parseISO } from "date-fns";

import type { DashboardExpenseMetrics, ExpenseRecord, ExpenseSummaryMetrics } from "@/types/expenses";
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
