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
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs text-[#9494b8] uppercase tracking-wider font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full appearance-none bg-[#0d0d1a] border border-[#1e1e35] rounded-[10px] px-3 py-2.5 text-sm text-[#e2e2f0]",
              "focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)]",
              "transition-all duration-200 cursor-pointer",
              error && "border-[#ef4444]",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0d0d1a]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c5c80] pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
