"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMode } from "@/hooks/useMode";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Avatar } from "@/components/ui/avatar";
import {
  Zap, Building2, LayoutDashboard, Briefcase, Users, Calendar,
  BarChart3, Settings, UserCircle, ClipboardList, Wallet, Star,
  Bell, LogOut, ChevronDown, Sun, Moon, Plus,
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
  const { mode, setMode } = useMode();
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
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-hairline bg-canvas/95 backdrop-blur-md">
      <div className="flex items-center h-full px-6 gap-6 max-w-[1440px] mx-auto">

        {/* Wordmark */}
        <Link
          href={isHR ? "/hr/employees" : "/dashboard"}
          className="flex items-center gap-2.5 flex-shrink-0 mr-2"
        >
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Zap size={14} className="text-on-primary" fill="currentColor" />
          </div>
          <span className="text-sm font-semibold text-ink tracking-tight">
            VOLT
          </span>
        </Link>

        {/* Mode pill-group (Cal.com nav-pill-group signature) */}
        <div className="flex items-center gap-1 bg-surface-soft rounded-full p-1 flex-shrink-0">
          <button
            onClick={() => setMode("volt")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
              !isHR
                ? "bg-canvas text-ink shadow-sm shadow-ink/10"
                : "text-muted hover:text-ink"
            )}
          >
            <Zap size={11} className={!isHR ? "text-badge-violet" : ""} />
            VOLT
          </button>
          <button
            onClick={() => setMode("hr")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
              isHR
                ? "bg-canvas text-ink shadow-sm shadow-ink/10"
                : "text-muted hover:text-ink"
            )}
          >
            <Building2 size={11} className={isHR ? "text-badge-emerald" : ""} />
            HR
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                  active
                    ? "bg-surface-card text-ink"
                    : "text-muted hover:text-ink hover:bg-surface-soft"
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* Quick add */}
          <button
            onClick={() => router.push(isHR ? "/hr/employees" : "/roles")}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-md text-sm font-semibold bg-primary text-on-primary hover:bg-primary-active transition-colors duration-150"
          >
            <Plus size={14} />
            New
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-md text-muted hover:text-ink hover:bg-surface-card transition-colors duration-150"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Settings */}
          <Link
            href="/settings"
            className="w-9 h-9 flex items-center justify-center rounded-md text-muted hover:text-ink hover:bg-surface-card transition-colors duration-150"
          >
            <Settings size={15} />
          </Link>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 h-9 px-2 rounded-md hover:bg-surface-card transition-colors duration-150"
            >
              <Avatar name={user?.user_metadata?.full_name || user?.email || "U"} size="xs" />
              <span className="text-xs font-medium text-ink max-w-[80px] truncate hidden sm:block">
                {user?.user_metadata?.full_name?.split(" ")[0] || "Account"}
              </span>
              <ChevronDown size={12} className="text-muted" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-canvas border border-hairline rounded-xl shadow-lg shadow-ink/8 z-20 overflow-hidden">
                  <div className="p-3.5 border-b border-hairline-soft">
                    <div className="text-sm font-semibold text-ink truncate">
                      {user?.user_metadata?.full_name || "User"}
                    </div>
                    <div className="text-xs text-muted mt-0.5 truncate">{user?.email}</div>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-body hover:text-ink hover:bg-surface-soft transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={14} />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/5 transition-colors"
                    >
                      <LogOut size={14} />
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
