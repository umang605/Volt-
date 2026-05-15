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

const palettes = [
  "bg-volt/12 text-volt",
  "bg-hr/12 text-hr",
  "bg-warning/12 text-warning",
  "bg-danger/12 text-danger",
  "bg-success/12 text-success",
];

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover border border-hairline", sizes[size], className)}
      />
    );
  }

  const paletteIndex = name.charCodeAt(0) % palettes.length;

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0 border border-hairline",
        sizes[size],
        palettes[paletteIndex],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
