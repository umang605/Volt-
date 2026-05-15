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
      "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed rounded-full whitespace-nowrap select-none";

    const variants = {
      primary:
        "bg-ink text-canvas hover:bg-ink-deep active:bg-ink-deep dark:bg-canvas dark:text-ink dark:hover:bg-surface-dark",
      secondary:
        "bg-canvas text-ink border border-hairline-strong hover:border-mute dark:bg-canvas dark:text-ink",
      ghost:
        "bg-transparent text-body hover:text-ink hover:bg-surface-soft dark:hover:bg-surface-soft",
      danger:
        "bg-canvas text-danger border border-hairline hover:bg-danger/5 dark:bg-canvas",
      "on-dark":
        "bg-canvas text-ink hover:bg-surface-dark dark:bg-ink dark:text-canvas",
    };

    const sizes = {
      sm: "text-xs px-3.5 py-1.5 h-7",
      md: "text-sm px-5 py-2 h-9",
      lg: "text-sm px-6 py-2.5 h-11",
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
