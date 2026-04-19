import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths
} from "date-fns";

import { FILTER_PERIODS, WEEK_STARTS_ON } from "@/lib/constants";
import type { FilterPeriod } from "@/types/sales";

export interface DateRange {
  from: Date;
  to: Date;
}

export function formatDateInput(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function parseDateInput(value: string) {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

export function getCurrentWeekRange(reference = new Date()): DateRange {
  return {
    from: startOfWeek(reference, { weekStartsOn: WEEK_STARTS_ON }),
    to: endOfWeek(reference, { weekStartsOn: WEEK_STARTS_ON })
  };
}

export function getCurrentMonthRange(reference = new Date()): DateRange {
  return {
    from: startOfMonth(reference),
    to: endOfMonth(reference)
  };
}

export function getRangeFromPreset(
  period: FilterPeriod,
  reference = new Date()
): DateRange | null {
  switch (period) {
    case "today":
      return { from: startOfDay(reference), to: endOfDay(reference) };
    case "last7days":
      return { from: startOfDay(subDays(reference, 6)), to: endOfDay(reference) };
    case "thisMonth":
      return getCurrentMonthRange(reference);
    case "lastMonth": {
      const previousMonth = subMonths(reference, 1);
      return {
        from: startOfMonth(previousMonth),
        to: endOfMonth(previousMonth)
      };
    }
    case "custom":
    case "all":
      return null;
    default: {
      const _exhaustiveCheck: never = period;
      return _exhaustiveCheck;
    }
  }
}

export function resolveDateRange(
  period: FilterPeriod,
  dateFrom?: string,
  dateTo?: string,
  reference = new Date()
) {
  if (!FILTER_PERIODS.includes(period)) {
    return null;
  }

  if (period === "custom") {
    const from = dateFrom ? parseDateInput(dateFrom) : null;
    const to = dateTo ? parseDateInput(dateTo) : null;

    if (!from || !to) {
      return null;
    }

    return { from: startOfDay(from), to: endOfDay(to) };
  }

  return getRangeFromPreset(period, reference);
}

