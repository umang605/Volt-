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
      <div className="flex flex-col">
        {label && (
          <label className="text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-canvas border border-hairline rounded-lg px-3.5 py-3 text-sm text-ink placeholder:text-muted-soft",
            "focus:outline-none focus:border-ink focus:ring-2 focus:ring-brand-accent/20",
            "transition-colors duration-150 resize-none",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
