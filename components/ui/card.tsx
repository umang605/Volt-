import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "dark";
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  variant = "default",
  hover,
  onClick,
}: CardProps) {
  const variants = {
    default: "bg-surface-card rounded-lg",
    outlined: "bg-canvas border border-hairline rounded-lg shadow-sm",
    dark: "bg-surface-dark text-on-dark rounded-lg",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        variants[variant],
        hover && "hover:shadow-md transition-shadow duration-200",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-8 pb-0", className)}>{children}</div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-8", className)}>{children}</div>
  );
}
