import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "volt" | "hr";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "bg-[#1a1a2e] text-[#9494b8] border border-[#252540]",
    success: "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20",
    warning: "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20",
    danger: "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20",
    volt: "bg-[#6366f1]/10 text-[#818cf8] border border-[#6366f1]/20",
    hr: "bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/20",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] font-medium font-[var(--font-dm-mono)]",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
