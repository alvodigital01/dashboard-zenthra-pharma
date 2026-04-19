"use client";

import { ArrowUpRight, BarChart3, FileBarChart2, LayoutDashboard, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/brand/brand-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sales", label: "Vendas", icon: BarChart3 },
  { href: "/reports", label: "Relatorios", icon: FileBarChart2 }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function Sidebar({
  isMobileOpen,
  onClose
}: {
  isMobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition duration-300 md:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-2 left-2 z-50 flex w-[calc(100vw-1rem)] max-w-[360px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-brand-veil px-4 py-4 text-white shadow-float transition-all duration-300 md:sticky md:top-4 md:h-[calc(100vh-2rem)] md:w-[292px] md:max-w-none md:self-start md:rounded-[34px] md:px-5 md:py-6",
          isMobileOpen ? "translate-x-0 opacity-100" : "-translate-x-[108%] opacity-0 md:translate-x-0 md:opacity-100"
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-14 top-0 h-44 w-44 rounded-[42%] border border-white/10" />
          <div className="absolute bottom-20 left-[-54px] h-52 w-52 rounded-[46%] bg-[radial-gradient(circle_at_center,rgba(48,118,196,0.24),transparent_68%)]" />
        </div>

        <div className="relative flex h-full min-h-0 flex-col">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo compact theme="dark" />
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white md:hidden"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="sidebar-scroll mt-6 min-h-0 flex-1 space-y-6 overflow-y-auto pr-1 md:mt-8 md:space-y-8">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:rounded-[28px] md:p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                Ambiente comercial
              </p>
              <div className="mt-4 space-y-2.5">
                <p className="text-xl font-semibold tracking-[-0.04em] text-white md:text-2xl">
                  Painel executivo
                </p>
                <p className="text-sm leading-6 text-slate-300 md:leading-7">
                  Visao clara da operacao comercial.
                </p>
              </div>
              <div className="brand-divider mt-5 h-px w-full" />
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Vendas, faturamento e historico em um so lugar.
              </p>
            </div>

            <div>
              <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Navegacao
              </p>
              <nav className="mt-4 space-y-2.5">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-[20px] px-3.5 py-3.5 text-sm font-medium transition md:rounded-[22px] md:px-4",
                        active
                          ? "bg-white text-slate-950 shadow-soft"
                          : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition",
                          active
                            ? "bg-[rgba(16,52,104,0.08)] text-primary"
                            : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                        <span className="truncate">{item.label}</span>
                        {active ? <ArrowUpRight className="h-4 w-4 shrink-0 text-primary/70" /> : null}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:mt-6 md:rounded-[28px]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Acao rapida
            </p>
            <Link
              href="/sales/new"
              className={buttonVariants({
                className:
                  "w-full justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(202,229,247,0.96))] text-slate-950 hover:-translate-y-0.5"
              })}
            >
              <PlusCircle className="h-4 w-4" />
              Nova venda
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
