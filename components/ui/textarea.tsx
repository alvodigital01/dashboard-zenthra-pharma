import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[140px] w-full rounded-[24px] border border-[rgba(16,46,94,0.1)] bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition placeholder:text-slate-400 focus:border-[rgba(20,88,155,0.38)] focus:bg-white focus:ring-4 focus:ring-[rgba(23,104,171,0.08)]",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
