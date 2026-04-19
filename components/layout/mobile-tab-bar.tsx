"use client";

import { BarChart3, FileBarChart2, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Início", icon: LayoutDashboard },
  { href: "/sales", label: "Vendas", icon: BarChart3 },
  { href: "/sales/new", label: "Nova", icon: Plus, highlight: true },
  { href: "/reports", label: "Relatórios", icon: FileBarChart2 }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/sales/new") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 md:hidden">
      <div className="glass-panel grid grid-cols-4 items-center gap-1 rounded-[28px] border border-white/80 px-2 py-2 shadow-panel">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-[22px] px-2 py-2.5 text-[0.68rem] font-semibold tracking-[0.02em] transition-all duration-200",
                item.highlight
                  ? "bg-[linear-gradient(135deg,rgba(14,43,91,1),rgba(20,77,146,1))] text-white shadow-soft"
                  : active
                    ? "bg-primary/[0.08] text-primary"
                    : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-2xl transition",
                  item.highlight
                    ? "bg-white/10 text-white"
                    : active
                      ? "bg-white text-primary shadow-soft"
                      : "bg-slate-100/80 text-slate-500"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
