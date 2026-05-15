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
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

// Cycle through Cal.com badge palette colors
const palettes = [
  "bg-badge-orange/20 text-badge-orange",
  "bg-badge-pink/20 text-badge-pink",
  "bg-badge-violet/20 text-badge-violet",
  "bg-badge-emerald/20 text-badge-emerald",
  "bg-brand-accent/20 text-brand-accent",
];

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover border border-hairline",
          sizes[size],
          className
        )}
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
