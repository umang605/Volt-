"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  Zap,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Briefcase,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { formatRelativeTime } from "@/lib/utils";

const MOCK_VELOCITY_DATA = [
  { week: "W1", applied: 12, screened: 8, interviewed: 5, offers: 2 },
  { week: "W2", applied: 18, screened: 11, interviewed: 7, offers: 3 },
  { week: "W3", applied: 15, screened: 13, interviewed: 9, offers: 4 },
  { week: "W4", applied: 22, screened: 16, interviewed: 11, offers: 5 },
  { week: "W5", applied: 19, screened: 14, interviewed: 8, offers: 3 },
  { week: "W6", applied: 28, screened: 20, interviewed: 14, offers: 7 },
];

const MOCK_ACTIVITY = [
  { user: "Sarah Chen", action: "moved Marcus Webb to Offer stage", time: "12m ago", type: "success" },
  { user: "James Okoro", action: "completed debrief for Frontend Lead", time: "1h ago", type: "info" },
  { user: "You", action: "posted Senior Backend Engineer role", time: "2h ago", type: "volt" },
  { user: "Priya Nair", action: "scheduled 3 interviews for Data Science", time: "3h ago", type: "info" },
  { user: "Sarah Chen", action: "rejected 2 candidates with feedback", time: "5h ago", type: "warning" },
];

const MOCK_ROLES = [
  { title: "Senior Backend Engineer", candidates: 14, health: 85, urgency: "high", daysOpen: 12 },
  { title: "Product Designer", candidates: 8, health: 62, urgency: "medium", daysOpen: 28 },
  { title: "Data Scientist", candidates: 22, health: 91, urgency: "urgent", daysOpen: 5 },
  { title: "Frontend Lead", candidates: 3, health: 31, urgency: "high", daysOpen: 45 },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [brief, setBrief] = useState<string>("");
  const [briefLoading, setBriefLoading] = useState(false);
  const [userName, setUserName] = useState("there");
  const [stats, setStats] = useState({
    urgentRoles: 3,
    inactiveCount: 5,
    expiringOffers: 1,
    totalCandidates: 47,
    hiredThisMonth: 4,
    pipelineHealth: 73,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(" ")[0]);
      }
    });
    loadMorningBrief();
  }, []);

  const loadMorningBrief = async () => {
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
      setBrief(
        `You have ${stats.urgentRoles} urgent roles that need attention today. ${stats.inactiveCount} candidates haven't heard from you in 5+ days — they're going cold. Your offer to Sara expires tomorrow. Pipeline health is at ${stats.pipelineHealth}% — strong, but that Frontend Lead role at 45 days open is a red flag. Prioritize it today.`
      );
    } finally {
      setBriefLoading(false);
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const healthColor = (score: number) =>
    score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  const urgencyBadge = (u: string) => {
    const map: Record<string, "danger" | "warning" | "volt" | "default"> = {
      urgent: "danger",
      high: "warning",
      medium: "volt",
      low: "default",
    };
    return map[u] || "default";
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold text-ink mb-1"
              
            >
              {greeting}, {userName} ⚡
            </h1>
            <p className="text-body text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => router.push("/candidates")}>
              <Users size={14} />
              Add Candidate
            </Button>
            <Button size="sm" onClick={() => router.push("/roles")}>
              <Plus size={14} />
              Post Role
            </Button>
          </div>
        </div>

        {/* AI Morning Brief */}
        <div className="bg-surface-dark rounded-[12px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-on-dark" />
            <span className="text-xs font-semibold text-on-dark uppercase tracking-wider">
              AI Morning Brief
            </span>
            <button
              onClick={loadMorningBrief}
              className="ml-auto text-xs text-on-dark/60 hover:text-on-dark transition-colors"
            >
              Refresh
            </button>
          </div>
          {briefLoading ? (
            <div className="space-y-2">
              <div className="h-4 rounded-full animate-shimmer w-full opacity-30" />
              <div className="h-4 rounded-full animate-shimmer w-4/5 opacity-30" />
              <div className="h-4 rounded-full animate-shimmer w-3/5 opacity-30" />
            </div>
          ) : (
            <p className="text-sm text-on-dark/90 leading-relaxed">{brief}</p>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Pipeline Health",
            value: `${stats.pipelineHealth}%`,
            sub: "Overall score",
            icon: TrendingUp,
            color: "#22c55e",
            trend: "+4%",
          },
          {
            label: "Active Candidates",
            value: stats.totalCandidates,
            sub: "Across all roles",
            icon: Users,
            color: "#818cf8",
            trend: "+12",
          },
          {
            label: "Hired This Month",
            value: stats.hiredThisMonth,
            sub: "Goal: 6",
            icon: CheckCircle2,
            color: "#22c55e",
            trend: "On track",
          },
          {
            label: "Needs Attention",
            value: stats.urgentRoles + stats.inactiveCount,
            sub: "Urgent items",
            icon: AlertTriangle,
            color: "#f59e0b",
            trend: "Act now",
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-4" hover>
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-soft border border-hairline"
              >
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <span className="text-[10px] text-mute">{stat.trend}</span>
            </div>
            <div className="text-2xl font-bold text-ink mb-0.5">
              {stat.value}
            </div>
            <div className="text-xs text-charcoal">{stat.label}</div>
            <div className="text-[10px] text-mute mt-0.5">{stat.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Pipeline Velocity Chart */}
        <Card className="lg:col-span-2 p-5" hover>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3
                className="text-sm font-bold text-ink" 
                
              >
                Pipeline Velocity
              </h3>
              <p className="text-xs text-mute mt-0.5">Candidates per stage per week</p>
            </div>
            <Badge variant="volt">6-Week View</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_VELOCITY_DATA}>
              <defs>
                <linearGradient id="applied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="interviewed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fill: "#a3a3a3", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#a3a3a3", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "12px",
                  fontSize: "11px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ color: "#737373" }}
              />
              <Area type="monotone" dataKey="applied" stroke="#6366f1" fill="url(#applied)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="screened" stroke="#818cf8" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              <Area type="monotone" dataKey="interviewed" stroke="#a855f7" fill="url(#interviewed)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="offers" stroke="#22c55e" fill="none" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            {[
              { color: "#6366f1", label: "Applied" },
              { color: "#818cf8", label: "Screened" },
              { color: "#a855f7", label: "Interviewed" },
              { color: "#22c55e", label: "Offers" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-0.5 rounded-full" style={{ background: l.color }} />
                <span className="text-[10px] text-mute">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Activity Feed */}
        <Card className="p-5" hover>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-ink">
              Team Activity
            </h3>
            <Clock size={13} className="text-mute" />
          </div>
          <div className="space-y-4">
            {MOCK_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar name={item.user} size="xs" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink leading-relaxed">
                    <span className="font-medium">{item.user}</span>{" "}
                    <span className="text-body">{item.action}</span>
                  </p>
                  <span className="text-[10px] text-mute">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Roles Summary */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-ink">
            Active Roles
          </h3>
          <Button variant="ghost" size="sm" onClick={() => router.push("/roles")}>
            View all <ArrowRight size={12} />
          </Button>
        </div>
        <div className="space-y-3">
          {MOCK_ROLES.map((role) => (
            <div
              key={role.title}
              className="flex items-center gap-4 p-3 rounded-[12px] hover:bg-surface-soft transition-colors cursor-pointer group border border-transparent hover:border-hairline"
              onClick={() => router.push("/roles")}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: healthColor(role.health) }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink truncate" >
                    {role.title}
                  </span>
                  <Badge variant={urgencyBadge(role.urgency)} size="sm">
                    {role.urgency}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-0.5">
                  <span className="text-[10px] text-mute">
                    {role.candidates} candidates
                  </span>
                  <span className="text-[10px] text-mute">
                    {role.daysOpen}d open
                  </span>
                </div>
              </div>
              {/* Health bar */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-20 h-1.5 bg-hairline rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${role.health}%`,
                      background: healthColor(role.health),
                    }}
                  />
                </div>
                <span className="text-xs text-mute w-8 text-right">{role.health}%</span>
              </div>
              <ArrowRight size={14} className="text-mute opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Briefcase, label: "Post New Role", href: "/roles", color: "#6366f1" },
          { icon: Users, label: "Add Candidate", href: "/candidates", color: "#a855f7" },
          { icon: Calendar, label: "Schedule Interview", href: "/interviews", color: "#818cf8" },
          { icon: TrendingUp, label: "View Analytics", href: "/analytics", color: "#22c55e" },
        ].map(({ icon: Icon, label, href, color }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="flex items-center gap-3 p-3 rounded-[12px] bg-canvas border border-hairline hover:border-hairline-strong hover:bg-surface-soft transition-colors group text-left"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-soft border border-hairline">
              <Icon size={15} style={{ color }} />
            </div>
            <span className="text-xs font-medium text-body group-hover:text-ink transition-colors">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
