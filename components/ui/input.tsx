"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-soft pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-canvas border border-hairline rounded-md px-3.5 h-10 text-sm text-ink placeholder:text-muted-soft",
              "focus:outline-none focus:border-ink focus:ring-2 focus:ring-brand-accent/20",
              "transition-colors duration-150",
              icon && "pl-10",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-danger mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
