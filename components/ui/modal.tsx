"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-[#0d0d1a] border border-[#1e1e35] rounded-[20px] shadow-2xl shadow-black/50",
          "animate-in fade-in slide-in-from-bottom-4 duration-200",
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[#1e1e35]">
            <h2 className="text-lg font-bold text-[#e2e2f0]" style={{ fontFamily: "Syne, sans-serif" }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-[#5c5c80] hover:text-[#e2e2f0] transition-colors p-1 rounded-lg hover:bg-[#1a1a2e]"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
