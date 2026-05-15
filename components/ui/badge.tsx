import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "volt" | "hr";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "bg-surface-soft text-charcoal border border-hairline",
    success: "bg-success/8 text-success border border-success/20",
    warning: "bg-warning/8 text-warning border border-warning/20",
    danger: "bg-danger/8 text-danger border border-danger/20",
    volt: "bg-volt/8 text-volt border border-volt/20",
    hr: "bg-hr/8 text-hr border border-hr/20",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium font-mono",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
