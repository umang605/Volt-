"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  TrendingUp, AlertTriangle, CheckCircle2, Clock, Users,
  Briefcase, Calendar, ArrowRight, Sparkles, Plus, RefreshCw,
  ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

const VELOCITY_DATA = [
  { week: "W1", applied: 12, interviewed: 5, offers: 2 },
  { week: "W2", applied: 18, interviewed: 7, offers: 3 },
  { week: "W3", applied: 15, interviewed: 9, offers: 4 },
  { week: "W4", applied: 22, interviewed: 11, offers: 5 },
  { week: "W5", applied: 19, interviewed: 8, offers: 3 },
  { week: "W6", applied: 28, interviewed: 14, offers: 7 },
];

const ACTIVITY = [
  { user: "Sarah Chen", action: "moved Marcus Webb to Offer stage", time: "12m ago", type: "success" },
  { user: "James Okoro", action: "completed debrief for Frontend Lead", time: "1h ago", type: "info" },
  { user: "You", action: "posted Senior Backend Engineer role", time: "2h ago", type: "default" },
  { user: "Priya Nair", action: "scheduled 3 interviews for Data Science", time: "3h ago", type: "info" },
  { user: "Sarah Chen", action: "flagged 2 candidates as high-risk", time: "5h ago", type: "warning" },
];

const ACTIVE_ROLES = [
  { title: "Senior Backend Engineer", candidates: 14, health: 85, urgency: "high", days: 12 },
  { title: "Product Designer", candidates: 8, health: 62, urgency: "medium", days: 28 },
  { title: "Data Scientist", candidates: 22, health: 91, urgency: "urgent", days: 5 },
  { title: "Frontend Lead", candidates: 3, health: 31, urgency: "high", days: 45 },
];

function HealthBar({ value }: { value: number }) {
  const color = value >= 70 ? "bg-success" : value >= 40 ? "bg-warning" : "bg-danger";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-hairline rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted tabular-nums w-7">{value}%</span>
    </div>
  );
}

const urgencyVariant: Record<string, "danger" | "warning" | "volt" | "default"> = {
  urgent: "danger", high: "warning", medium: "volt", low: "default",
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [brief, setBrief] = useState("");
  const [briefLoading, setBriefLoading] = useState(false);
  const [userName, setUserName] = useState("there");
  const stats = { urgentRoles: 3, inactiveCount: 5, total: 47, hired: 4, health: 73 };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) setUserName(user.user_metadata.full_name.split(" ")[0]);
    });
    loadBrief();
  }, []);

  const loadBrief = async () => {
    setBriefLoading(true);
    try {
      const res = await fetch("/api/ai/morning-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, ...stats }),
      });
      const data = await res.json();
      setBrief(data.brief || "");
    } catch {
      setBrief(`You have ${stats.urgentRoles} urgent roles needing attention. ${stats.inactiveCount} candidates haven't heard from you in 5+ days. Pipeline health is ${stats.health}% — the Frontend Lead at 45 days is a red flag. Prioritize it today.`);
    } finally {
      setBriefLoading(false);
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const STATS = [
    { label: "Pipeline Health", value: `${stats.health}%`, trend: "+4%", up: true, icon: TrendingUp, sub: "vs last month" },
    { label: "Active Candidates", value: stats.total, trend: "+12", up: true, icon: Users, sub: "across all roles" },
    { label: "Hired This Month", value: stats.hired, trend: "0", up: null, icon: CheckCircle2, sub: "goal: 6" },
    { label: "Needs Attention", value: stats.urgentRoles + stats.inactiveCount, trend: "+2", up: false, icon: AlertTriangle, sub: "act today" },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-xl font-semibold text-ink">
            {greeting}, {userName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => router.push("/candidates")}>
            <Users size={14} />
            Add candidate
          </Button>
          <Button size="sm" onClick={() => router.push("/roles")}>
            <Plus size={14} />
            Post role
          </Button>
        </div>
      </div>

      {/* AI Brief — the dark "featured" surface (Cal.com pricing-tier-card-featured equivalent) */}
      <div className="bg-surface-dark rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-on-dark/10 flex items-center justify-center">
              <Sparkles size={11} className="text-on-dark" />
            </div>
            <span className="text-xs font-semibold text-on-dark tracking-wide uppercase">
              AI Morning Brief
            </span>
          </div>
          <button
            onClick={loadBrief}
            className="flex items-center gap-1.5 text-xs text-on-dark-soft hover:text-on-dark transition-colors"
          >
            <RefreshCw size={11} />
            Refresh
          </button>
        </div>
        {briefLoading ? (
          <div className="space-y-2.5">
            <div className="h-3.5 rounded-full animate-shimmer opacity-20 w-full" />
            <div className="h-3.5 rounded-full animate-shimmer opacity-20 w-4/5" />
            <div className="h-3.5 rounded-full animate-shimmer opacity-20 w-3/5" />
          </div>
        ) : (
          <p className="text-sm text-on-dark-soft leading-relaxed">{brief}</p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-8 h-8 rounded-lg bg-canvas border border-hairline flex items-center justify-center">
                <s.icon size={15} className="text-muted" />
              </div>
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                s.up === true ? "text-success" : s.up === false ? "text-danger" : "text-muted"
              )}>
                {s.up === true ? <ArrowUpRight size={12} /> : s.up === false ? <ArrowDownRight size={12} /> : <Minus size={12} />}
                {s.trend}
              </div>
            </div>
            <p className="text-2xl font-semibold text-ink tracking-tight mb-1">{s.value}</p>
            <p className="text-xs font-medium text-body">{s.label}</p>
            <p className="text-xs text-muted mt-0.5">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Pipeline velocity */}
        <Card variant="outlined" className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-ink">Pipeline velocity</h3>
              <p className="text-xs text-muted mt-0.5">Applications per stage · 6 weeks</p>
            </div>
            <Badge variant="default" size="sm">Live</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={VELOCITY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gApplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111111" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gOffers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                labelStyle={{ color: "#374151", fontWeight: 600 }}
                itemStyle={{ color: "#6b7280" }}
              />
              <Area type="monotone" dataKey="applied" stroke="#111111" strokeWidth={1.5} fill="url(#gApplied)" dot={false} name="Applied" />
              <Area type="monotone" dataKey="interviewed" stroke="#6b7280" strokeWidth={1.5} strokeDasharray="4 2" fill="none" dot={false} name="Interviewed" />
              <Area type="monotone" dataKey="offers" stroke="#10b981" strokeWidth={1.5} fill="url(#gOffers)" dot={false} name="Offers" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3">
            {[{ color: "#111111", label: "Applied" }, { color: "#6b7280", label: "Interviewed" }, { color: "#10b981", label: "Offers" }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded-full" style={{ background: l.color }} />
                <span className="text-[11px] text-muted">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Team activity */}
        <Card variant="outlined" className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink">Team activity</h3>
            <Clock size={14} className="text-muted" />
          </div>
          <div className="space-y-4">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar name={item.user} size="xs" />
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs text-body leading-relaxed">
                    <span className="font-medium text-ink">{item.user}</span>{" "}
                    {item.action}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active roles */}
      <Card variant="outlined" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-ink">Active roles</h3>
          <Button variant="ghost" size="sm" onClick={() => router.push("/roles")}>
            View all <ArrowRight size={13} />
          </Button>
        </div>
        <div className="space-y-1">
          {ACTIVE_ROLES.map((role) => (
            <div
              key={role.title}
              className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-surface-soft transition-colors cursor-pointer group"
              onClick={() => router.push("/roles")}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-0.5">
                  <span className="text-sm font-medium text-ink truncate">{role.title}</span>
                  <Badge variant={urgencyVariant[role.urgency]} size="sm">{role.urgency}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">{role.candidates} candidates</span>
                  <span className="text-xs text-muted">{role.days}d open</span>
                </div>
              </div>
              <HealthBar value={role.health} />
              <ArrowRight size={13} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          ))}
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Briefcase, label: "Post a role", href: "/roles" },
          { icon: Users, label: "Add candidate", href: "/candidates" },
          { icon: Calendar, label: "Schedule interview", href: "/interviews" },
          { icon: TrendingUp, label: "View analytics", href: "/analytics" },
        ].map(({ icon: Icon, label, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="flex items-center gap-3 p-4 rounded-lg border border-hairline hover:border-muted hover:bg-surface-soft transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-muted group-hover:text-ink transition-colors" />
            </div>
            <span className="text-sm font-medium text-body group-hover:text-ink transition-colors">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
