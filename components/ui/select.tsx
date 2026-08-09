import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-12 w-full rounded-[20px] border border-[rgba(138,105,47,0.16)] bg-[#fffdf8]/95 px-4 text-sm font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition focus:border-[rgba(138,105,47,0.48)] focus:bg-[#fffdf8] focus:ring-4 focus:ring-[rgba(199,166,98,0.14)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
