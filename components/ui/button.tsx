import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "default" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function buttonVariants({
  variant = "primary",
  size = "default",
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[0.01em] transition-all duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
    variant === "primary" &&
      "bg-[linear-gradient(135deg,#e0bf79,#b98736)] text-[#15130f] shadow-float hover:-translate-y-0.5 hover:brightness-[1.04]",
    variant === "secondary" &&
      "bg-[linear-gradient(180deg,#faf7f0,#eee7da)] text-[#4f473c] shadow-soft hover:bg-[#f2ebdf]",
    variant === "outline" &&
      "border border-[rgba(138,105,47,0.2)] bg-[#fffdf8]/[0.9] text-[#51493e] shadow-soft backdrop-blur hover:border-[rgba(138,105,47,0.38)] hover:bg-[#fffdf8]",
    variant === "ghost" &&
      "text-slate-600 hover:bg-[rgba(138,105,47,0.08)] hover:text-slate-900",
    variant === "danger" &&
      "bg-[linear-gradient(135deg,rgba(173,35,35,1),rgba(210,66,66,1))] text-white shadow-soft hover:brightness-[1.03]",
    size === "sm" && "h-10 px-4 text-sm",
    size === "default" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-6 text-sm",
    size === "icon" && "h-11 w-11 rounded-2xl",
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
