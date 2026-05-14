"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "hr";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-[10px] whitespace-nowrap";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white hover:opacity-90 active:scale-[0.98] shadow-lg shadow-[rgba(99,102,241,0.3)]",
      secondary:
        "bg-[#1a1a2e] border border-[#252540] text-[#e2e2f0] hover:border-[#6366f1] hover:text-white",
      ghost: "text-[#9494b8] hover:text-[#e2e2f0] hover:bg-[#1a1a2e]",
      danger: "bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/20",
      hr: "bg-gradient-to-r from-[#14b8a6] to-[#10b981] text-white hover:opacity-90 active:scale-[0.98] shadow-lg shadow-[rgba(20,184,166,0.3)]",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 h-7",
      md: "text-sm px-4 py-2 h-9",
      lg: "text-sm px-6 py-3 h-11",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
