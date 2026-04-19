import Image from "next/image";

import { cn } from "@/lib/utils";

export function BrandLogo({
  theme = "dark",
  compact = false,
  className,
  subtitle = "Sales command center"
}: {
  theme?: "dark" | "light";
  compact?: boolean;
  className?: string;
  subtitle?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[22px] border p-1.5",
          theme === "dark"
            ? "border-white/10 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            : "border-[rgba(17,45,92,0.08)] bg-white shadow-soft"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-[18px] bg-white",
            compact ? "h-11 w-11" : "h-14 w-14"
          )}
        >
          <Image
            src="/brand-logo.png"
            alt="Logo Zenthra"
            fill
            sizes={compact ? "44px" : "56px"}
            className="object-cover object-center scale-[1.08]"
            priority
          />
        </div>
      </div>

      <div>
        <p
          className={cn(
            "font-display leading-none tracking-[0.02em]",
            compact ? "text-[1.55rem]" : "text-[2rem]",
            theme === "dark" ? "text-white" : "text-slate-950"
          )}
        >
          Zenthra
        </p>
        <p
          className={cn(
            "text-xs uppercase tracking-[0.22em]",
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          )}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
