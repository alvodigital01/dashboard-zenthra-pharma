import Image from "next/image";

import { cn } from "@/lib/utils";
import rochaLogo from "@/logorochacustombancos.jpeg";

export function BrandLogo({
  theme = "dark",
  compact = false,
  className,
  subtitle = "Bancos & espumas"
}: {
  theme?: "dark" | "light";
  compact?: boolean;
  className?: string;
  subtitle?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col items-start gap-2", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[18px] border bg-[#0b0b0a] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.75)]",
          compact ? "h-[52px] w-44 sm:w-52" : "h-[78px] w-full max-w-[340px]",
          theme === "dark"
            ? "border-[#c99543]/25"
            : "border-[#b37c2d]/20"
        )}
      >
        <Image
          src={rochaLogo}
          alt="Rocha Custom Bancos"
          fill
          sizes={compact ? "208px" : "340px"}
          className="object-contain object-left"
          priority
        />
      </div>

      <p
        className={cn(
          "pl-1 text-[0.62rem] font-semibold uppercase tracking-[0.26em]",
          theme === "dark" ? "text-[#d7ad68]" : "text-[#8e6528]"
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}
