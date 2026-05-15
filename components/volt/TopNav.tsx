"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMode } from "@/hooks/useMode";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
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
  Sun,
  Moon,
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
  const { theme, toggle: toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  const isHR = mode === "hr";
  const navItems = isHR ? HR_NAV : VOLT_NAV;

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-hairline bg-canvas/90 backdrop-blur-xl">
      <div className="flex items-center h-full px-5 gap-5">

        {/* Logo */}
        <Link
          href={isHR ? "/hr/employees" : "/dashboard"}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            {isHR ? (
              <Building2 size={13} className="text-canvas" />
            ) : (
              <Zap size={13} className="text-canvas" fill="currentColor" />
            )}
          </div>
          <span
            className="font-bold text-base text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isHR ? "HR" : "VOLT"}
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 whitespace-nowrap",
                  active
                    ? "bg-ink text-canvas dark:bg-canvas dark:text-ink"
                    : "text-body hover:text-ink hover:bg-surface-soft"
                )}
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Icon size={12} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Mode toggle pill */}
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-hairline-strong text-body hover:text-ink hover:border-mute transition-colors duration-150"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {isHR ? (
              <>
                <Building2 size={11} />
                HR
                <span className="text-mute">→ VOLT</span>
              </>
            ) : (
              <>
                <Zap size={11} />
                VOLT
                <span className="text-mute">→ HR</span>
              </>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-mute hover:text-ink hover:bg-surface-soft transition-colors duration-150"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            className="p-1.5 rounded-full text-mute hover:text-ink hover:bg-surface-soft transition-colors duration-150"
          >
            <Settings size={14} />
          </Link>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-surface-soft transition-colors duration-150"
            >
              <Avatar name={user?.user_metadata?.full_name || user?.email || "U"} size="xs" />
              <ChevronDown size={11} className="text-mute" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-canvas border border-hairline rounded-[12px] shadow-lg shadow-ink/5 z-20 overflow-hidden">
                  <div className="p-3 border-b border-hairline">
                    <div className="text-xs font-semibold text-ink truncate">
                      {user?.user_metadata?.full_name || "User"}
                    </div>
                    <div className="text-[11px] text-body truncate">{user?.email}</div>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-full text-xs text-body hover:text-ink hover:bg-surface-soft transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={13} />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-full text-xs text-danger hover:bg-danger/5 transition-colors"
                    >
                      <LogOut size={13} />
                      Sign out
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
