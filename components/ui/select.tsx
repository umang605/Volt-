"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full appearance-none bg-canvas border border-hairline rounded-md px-3.5 h-10 text-sm text-ink",
              "focus:outline-none focus:border-ink focus:ring-2 focus:ring-brand-accent/20",
              "transition-colors duration-150 cursor-pointer",
              error && "border-danger focus:border-danger focus:ring-danger/20",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-canvas text-ink">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
        </div>
        {error && <p className="text-sm text-danger mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
