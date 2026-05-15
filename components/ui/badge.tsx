import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "volt" | "hr" | "orange";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-surface-card text-ink border border-hairline",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    danger: "bg-danger/10 text-danger border border-danger/20",
    volt: "bg-badge-violet/10 text-badge-violet border border-badge-violet/20",
    hr: "bg-badge-emerald/10 text-badge-emerald border border-badge-emerald/20",
    orange: "bg-badge-orange/10 text-badge-orange",
  };

  const sizes = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
