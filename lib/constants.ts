export const APP_NAME = "Zenthra Pharma Sales";
export const WEEK_STARTS_ON = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const VALID_CALCULATION_STATUSES = ["paid", "completed"] as const;
export const SALE_STATUSES = ["pending", "paid", "completed", "cancelled"] as const;
export const FILTER_PERIODS = [
  "all",
  "today",
  "last7days",
  "thisMonth",
  "lastMonth",
  "custom"
] as const;

export const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Dashboard Zenthra",
    description: ""
  },
  "/sales": {
    title: "Vendas",
    description: "Cadastre, filtre e acompanhe as vendas."
  },
  "/sales/new": {
    title: "Nova venda",
    description: "Registre uma venda com cálculo automático."
  },
  "/reports": {
    title: "Relatórios",
    description: "Resumo por período, semana e mês."
  }
};
