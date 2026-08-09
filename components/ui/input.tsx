import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-[20px] border border-[rgba(138,105,47,0.16)] bg-[#fffdf8]/95 px-4 text-sm font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition placeholder:text-slate-400 focus:border-[rgba(138,105,47,0.48)] focus:bg-[#fffdf8] focus:ring-4 focus:ring-[rgba(199,166,98,0.14)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
