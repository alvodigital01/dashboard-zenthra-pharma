"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { Header } from "@/components/layout/header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { useMobileMenu } from "@/hooks/use-mobile-menu";

export function AppShell({
  userEmail,
  children
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isOpen, openMenu, closeMenu } = useMobileMenu();

  useEffect(() => {
    closeMenu();
  }, [closeMenu, pathname]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 md:px-6">
      <div className="mx-auto flex max-w-[1680px] items-start gap-4 lg:gap-6">
        <Sidebar isMobileOpen={isOpen} onClose={closeMenu} />
        <div className="min-w-0 flex-1 space-y-4 md:space-y-6">
          <Header userEmail={userEmail} onOpenMenu={openMenu} />
          <main className="min-w-0 space-y-5 pb-28 md:space-y-6 md:pb-10">{children}</main>
        </div>
      </div>
      <MobileTabBar />
    </div>
  );
}
