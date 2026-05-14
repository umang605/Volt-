import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  const colors = [
    "from-[#6366f1] to-[#a855f7]",
    "from-[#14b8a6] to-[#10b981]",
    "from-[#f59e0b] to-[#ef4444]",
    "from-[#ec4899] to-[#a855f7]",
    "from-[#3b82f6] to-[#6366f1]",
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white flex-shrink-0",
        sizes[size],
        colors[colorIndex],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
