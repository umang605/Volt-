"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "on-dark";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed rounded-md whitespace-nowrap select-none";

    const variants = {
      primary:
        "bg-primary text-on-primary hover:bg-primary-active active:bg-primary-active",
      secondary:
        "bg-canvas text-ink border border-hairline hover:bg-surface-soft hover:border-muted",
      ghost:
        "bg-transparent text-muted hover:text-ink hover:bg-surface-card",
      danger:
        "bg-canvas text-danger border border-danger/30 hover:bg-danger/5",
      "on-dark":
        "bg-canvas text-ink hover:bg-surface-soft",
    };

    const sizes = {
      sm: "text-xs px-3.5 h-8",
      md: "text-sm px-5 h-10",
      lg: "text-sm px-6 h-11",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
