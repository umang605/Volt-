"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMode } from "@/hooks/useMode";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/avatar";
import {
  Zap,
  Building2,
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Settings,
  UserCircle,
  ClipboardList,
  Wallet,
  Star,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const VOLT_NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/roles", icon: Briefcase, label: "Roles" },
  { href: "/candidates", icon: Users, label: "Candidates" },
  { href: "/interviews", icon: Calendar, label: "Interviews" },
  { href: "/team", icon: UserCircle, label: "Team" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
];

const HR_NAV = [
  { href: "/hr/employees", icon: Users, label: "Employees" },
  { href: "/hr/attendance", icon: ClipboardList, label: "Attendance" },
  { href: "/hr/payroll", icon: Wallet, label: "Payroll" },
  { href: "/hr/performance", icon: Star, label: "Performance" },
  { href: "/hr/onboarding", icon: Zap, label: "Onboarding" },
  { href: "/hr/announcements", icon: Bell, label: "Culture" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, toggle } = useMode();
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const isHR = mode === "hr";
  const navItems = isHR ? HR_NAV : VOLT_NAV;

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const accentColor = isHR ? "#14b8a6" : "#6366f1";
  const accentGradient = isHR
    ? "from-[#14b8a6] to-[#10b981]"
    : "from-[#6366f1] to-[#a855f7]";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-[#1e1e35] bg-[#080810]/90 backdrop-blur-xl">
      <div className="flex items-center h-full px-4 gap-6">
        {/* Logo */}
        <Link href={isHR ? "/hr/employees" : "/dashboard"} className="flex items-center gap-2 flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${accentGradient} flex items-center justify-center shadow-md`}
            style={{ boxShadow: `0 0 12px ${accentColor}40` }}
          >
            {isHR ? (
              <Building2 size={15} className="text-white" />
            ) : (
              <Zap size={15} className="text-white" fill="white" />
            )}
          </div>
          <span
            className="font-bold text-lg text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {isHR ? "HR" : "VOLT"}
          </span>
        </Link>

        {/* Nav items */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs transition-all duration-150 whitespace-nowrap",
                  active
                    ? isHR
                      ? "bg-[rgba(20,184,166,0.12)] text-[#14b8a6]"
                      : "bg-[rgba(99,102,241,0.12)] text-[#818cf8]"
                    : "text-[#9494b8] hover:text-[#e2e2f0] hover:bg-[#1a1a2e]"
                )}
              >
                <Icon size={13} />
                <span style={{ fontFamily: "DM Mono, monospace" }}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mode Toggle */}
          <button
            onClick={toggle}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-[8px] border text-xs font-medium transition-all duration-300",
              isHR
                ? "border-[#14b8a6]/40 bg-[rgba(20,184,166,0.08)] text-[#14b8a6] hover:bg-[rgba(20,184,166,0.15)]"
                : "border-[#6366f1]/40 bg-[rgba(99,102,241,0.08)] text-[#818cf8] hover:bg-[rgba(99,102,241,0.15)]"
            )}
          >
            {isHR ? (
              <>
                <Building2 size={12} />
                <span>HR Mode</span>
                <div className="w-px h-3 bg-current opacity-30" />
                <span className="opacity-60">→ VOLT</span>
              </>
            ) : (
              <>
                <Zap size={12} fill="currentColor" />
                <span>VOLT</span>
                <div className="w-px h-3 bg-current opacity-30" />
                <span className="opacity-60">→ HR</span>
              </>
            )}
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            className="text-[#5c5c80] hover:text-[#9494b8] transition-colors p-1.5 rounded-[8px] hover:bg-[#1a1a2e]"
          >
            <Settings size={15} />
          </Link>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-[10px] hover:bg-[#1a1a2e] transition-colors"
            >
              <Avatar name={user?.user_metadata?.full_name || user?.email || "U"} size="xs" />
              <ChevronDown size={12} className="text-[#5c5c80]" />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0d0d1a] border border-[#1e1e35] rounded-[12px] shadow-xl z-20 overflow-hidden">
                  <div className="p-3 border-b border-[#1e1e35]">
                    <div className="text-xs font-semibold text-[#e2e2f0] truncate">
                      {user?.user_metadata?.full_name || "User"}
                    </div>
                    <div className="text-[10px] text-[#5c5c80] truncate">{user?.email}</div>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs text-[#9494b8] hover:text-[#e2e2f0] hover:bg-[#1a1a2e] transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={13} />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                    >
                      <LogOut size={13} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
