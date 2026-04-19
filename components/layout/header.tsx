"use client";

import { CalendarDays, ChevronRight, Menu, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/layout/logout-button";
import { Button } from "@/components/ui/button";
import { PAGE_TITLES } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

function resolvePageMeta(pathname: string) {
  if (pathname.startsWith("/sales/") && pathname.endsWith("/edit")) {
    return {
      title: "Editar venda",
      description: "Edite a venda sem perder o histórico."
    };
  }

  if (pathname.startsWith("/sales/")) {
    return PAGE_TITLES["/sales/new"];
  }

  return PAGE_TITLES[pathname] ?? PAGE_TITLES["/"];
}

export function Header({
  userEmail,
  onOpenMenu
}: {
  userEmail: string;
  onOpenMenu: () => void;
}) {
  const pathname = usePathname();
  const meta = resolvePageMeta(pathname);
  const today = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());

  return (
    <header className="glass-panel sticky top-3 z-30 rounded-[22px] border border-white/80 px-4 py-3 shadow-panel md:top-4 md:rounded-[30px] md:px-6 md:py-4">
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-[16px] border-white/70 bg-white/85 md:hidden"
              onClick={onOpenMenu}
            >
              <Menu className="h-4.5 w-4.5" />
            </Button>

            <div className="hidden flex-wrap items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500 md:flex">
              <span>Zenthra pharma</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate">{meta.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 rounded-[22px] border border-[rgba(16,46,94,0.08)] bg-white/[0.88] px-4 py-3 xl:flex">
              <div className="rounded-2xl bg-primary/[0.06] p-2 text-primary">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Atualizado
                </p>
                <p className="text-sm font-semibold text-slate-900">{today}</p>
              </div>
            </div>

            <LogoutButton />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 space-y-1.5">
            <h2 className="text-[1.2rem] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[1.35rem] md:text-[1.55rem]">
              {meta.title}
            </h2>
            {meta.description ? (
              <p className="max-w-2xl text-sm leading-5 text-muted-foreground md:leading-6">
                {meta.description}
              </p>
            ) : null}
          </div>

          <div className="hidden min-w-0 items-center gap-3 rounded-[22px] border border-[rgba(16,46,94,0.08)] bg-white/[0.88] px-4 py-3 sm:flex">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] bg-primary text-sm font-semibold text-white">
              {getInitials(userEmail)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{userEmail}</p>
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Sessão autenticada
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
