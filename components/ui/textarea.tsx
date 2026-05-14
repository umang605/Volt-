"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs text-[#9494b8] uppercase tracking-wider font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-[#0d0d1a] border border-[#1e1e35] rounded-[10px] px-3 py-2.5 text-sm text-[#e2e2f0] placeholder:text-[#5c5c80]",
            "focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)]",
            "transition-all duration-200 resize-none",
            error && "border-[#ef4444]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
