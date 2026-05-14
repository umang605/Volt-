import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, glow, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[#0d0d1a] border border-[#1e1e35] rounded-[16px] transition-all duration-200",
        glow && "hover:border-[rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.08)]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-5 pb-0", className)}>{children}</div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-5", className)}>{children}</div>
  );
}
