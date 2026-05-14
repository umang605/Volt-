"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Clock, DollarSign, Users } from "lucide-react";

const FUNNEL_DATA = [
  { name: "Applied", value: 247, fill: "#6366f1" },
  { name: "Screened", value: 148, fill: "#818cf8" },
  { name: "Interviewed", value: 89, fill: "#a855f7" },
  { name: "Offered", value: 31, fill: "#f59e0b" },
  { name: "Hired", value: 22, fill: "#22c55e" },
];

const TIME_TO_HIRE_DATA = [
  { role: "Backend Eng", days: 38 },
  { role: "Product Design", days: 52 },
  { role: "Data Science", days: 31 },
  { role: "Frontend Lead", days: 71 },
  { role: "DevOps", days: 28 },
];

const TEAM_PERF_DATA = [
  { month: "Jan", hires: 3, offers: 5, timeToHire: 42 },
  { month: "Feb", hires: 4, offers: 6, timeToHire: 38 },
  { month: "Mar", hires: 2, offers: 4, timeToHire: 45 },
  { month: "Apr", hires: 6, offers: 8, timeToHire: 33 },
  { month: "May", hires: 5, offers: 7, timeToHire: 29 },
];

const SALARY_DATA = [
  { role: "Backend Eng", market: 160000, offer: 155000 },
  { role: "Product Design", market: 135000, offer: 128000 },
  { role: "Data Science", market: 150000, offer: 148000 },
  { role: "Frontend Lead", market: 165000, offer: 158000 },
];

const DROP_REASONS = [
  { stage: "Applied → Screened", dropped: 99, pct: 40 },
  { stage: "Screened → Interview", dropped: 59, pct: 40 },
  { stage: "Interview → Offer", dropped: 58, pct: 65 },
  { stage: "Offer → Hired", dropped: 9, pct: 29 },
];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#0d0d1a",
    border: "1px solid #1e1e35",
    borderRadius: "10px",
    fontSize: "11px",
  },
  labelStyle: { color: "#9494b8" },
};

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
          Hiring Memory
        </h1>
        <p className="text-[#9494b8] text-sm">Every pattern. Every signal. Nothing hidden.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Avg Time to Hire", value: "31 days", change: "-5 days", positive: true, icon: Clock, color: "#818cf8" },
          { label: "Offer Acceptance", value: "71%", change: "+3%", positive: true, icon: TrendingUp, color: "#22c55e" },
          { label: "Pipeline Conversion", value: "8.9%", change: "+1.2%", positive: true, icon: Users, color: "#a855f7" },
          { label: "Avg Salary Offered", value: "$147k", change: "-$3k vs market", positive: false, icon: DollarSign, color: "#f59e0b" },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                style={{ background: `${kpi.color}18` }}
              >
                <kpi.icon size={14} style={{ color: kpi.color }} />
              </div>
              <div
                className="flex items-center gap-1 text-[10px]"
                style={{ color: kpi.positive ? "#22c55e" : "#ef4444" }}
              >
                {kpi.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {kpi.change}
              </div>
            </div>
            <div className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "Syne, sans-serif" }}>
              {kpi.value}
            </div>
            <div className="text-xs text-[#9494b8]">{kpi.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Pipeline Funnel */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Pipeline Funnel
            </h3>
            <Badge variant="default">Last 90 days</Badge>
          </div>
          <div className="space-y-2">
            {FUNNEL_DATA.map((stage, i) => {
              const pct = Math.round((stage.value / FUNNEL_DATA[0].value) * 100);
              return (
                <div key={stage.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#9494b8]">{stage.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#e2e2f0]" style={{ fontFamily: "Syne, sans-serif" }}>
                        {stage.value}
                      </span>
                      <span className="text-[#5c5c80]">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-6 bg-[#12121f] rounded-[6px] overflow-hidden">
                    <div
                      className="h-full rounded-[6px] flex items-center pl-2 transition-all"
                      style={{ width: `${pct}%`, background: stage.fill }}
                    >
                      {pct > 15 && (
                        <span className="text-white text-[9px] font-bold">{stage.value}</span>
                      )}
                    </div>
                  </div>
                  {i < FUNNEL_DATA.length - 1 && (
                    <div className="text-[10px] text-[#ef4444] mt-1 pl-1">
                      ↓ {DROP_REASONS[i]?.dropped} dropped ({DROP_REASONS[i]?.pct}%)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Time to Hire by Role */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Time to Hire by Role
            </h3>
            <Badge variant="default">Days</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TIME_TO_HIRE_DATA} layout="vertical">
              <XAxis type="number" tick={{ fill: "#5c5c80", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="role"
                tick={{ fill: "#9494b8", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar
                dataKey="days"
                radius={[0, 6, 6, 0]}
                fill="url(#barGrad)"
              >
                {TIME_TO_HIRE_DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.days > 50 ? "#ef4444" : entry.days > 40 ? "#f59e0b" : "#6366f1"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Team Performance Over Time */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Team Performance
            </h3>
            <Badge variant="volt">5-Month View</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TEAM_PERF_DATA}>
              <XAxis dataKey="month" tick={{ fill: "#5c5c80", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5c5c80", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="hires"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", r: 3 }}
                name="Hired"
              />
              <Line
                type="monotone"
                dataKey="offers"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: "#6366f1", r: 3 }}
                name="Offers"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[
              { color: "#22c55e", label: "Hired" },
              { color: "#6366f1", label: "Offers" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-0.5 rounded-full" style={{ background: l.color }} />
                <span className="text-[10px] text-[#5c5c80]">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Salary Benchmark */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Salary Benchmark
            </h3>
            <Badge variant="warning">Below market</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SALARY_DATA}>
              <XAxis dataKey="role" tick={{ fill: "#5c5c80", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#5c5c80", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                formatter={(v) => typeof v === "number" ? `$${v.toLocaleString()}` : String(v)}
              />
              <Bar dataKey="market" name="Market Rate" fill="#252540" radius={[4, 4, 0, 0]} />
              <Bar dataKey="offer" name="Your Offers" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[
              { color: "#252540", label: "Market Rate" },
              { color: "#6366f1", label: "Your Offers" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: l.color }} />
                <span className="text-[10px] text-[#5c5c80]">{l.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
