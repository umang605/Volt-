"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Search,
  Plus,
  Users,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Calendar,
  ChevronRight,
  Star,
} from "lucide-react";
import type { Employee } from "@/types";

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1", company_id: "c1", full_name: "Arjun Mehta", email: "arjun@co.com",
    department: "Engineering", role: "Senior Engineer", employment_type: "full_time",
    status: "active", salary: 145000, join_date: "2022-03-15",
    performance_score: 88, attrition_risk: 18, created_at: "2022-03-15",
  },
  {
    id: "2", company_id: "c1", full_name: "Priya Sharma", email: "priya@co.com",
    department: "Product", role: "Product Manager", employment_type: "full_time",
    status: "active", salary: 135000, join_date: "2021-08-01",
    performance_score: 94, attrition_risk: 12, created_at: "2021-08-01",
  },
  {
    id: "3", company_id: "c1", full_name: "Ravi Kumar", email: "ravi@co.com",
    department: "Engineering", role: "DevOps Engineer", employment_type: "full_time",
    status: "active", salary: 130000, join_date: "2023-01-10",
    performance_score: 76, attrition_risk: 42, created_at: "2023-01-10",
  },
  {
    id: "4", company_id: "c1", full_name: "Neha Patel", email: "neha@co.com",
    department: "Design", role: "UX Designer", employment_type: "full_time",
    status: "on_leave", salary: 115000, join_date: "2022-06-20",
    performance_score: 82, attrition_risk: 25, created_at: "2022-06-20",
  },
  {
    id: "5", company_id: "c1", full_name: "Anand Krishnan", email: "anand@co.com",
    department: "Data", role: "Data Analyst", employment_type: "full_time",
    status: "active", salary: 110000, join_date: "2023-07-05",
    performance_score: 71, attrition_risk: 61, created_at: "2023-07-05",
  },
  {
    id: "6", company_id: "c1", full_name: "Divya Menon", email: "divya@co.com",
    department: "Marketing", role: "Growth Manager", employment_type: "full_time",
    status: "active", salary: 105000, join_date: "2022-11-01",
    performance_score: 90, attrition_risk: 9, created_at: "2022-11-01",
  },
];

const STATUS_COLORS: Record<string, "success" | "warning" | "danger" | "default"> = {
  active: "success",
  on_leave: "warning",
  inactive: "danger",
};

const DEPT_COLORS: Record<string, string> = {
  Engineering: "#6366f1",
  Product: "#a855f7",
  Design: "#ec4899",
  Data: "#14b8a6",
  Marketing: "#f59e0b",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [deptFilter, setDeptFilter] = useState("all");

  const depts = ["all", ...Array.from(new Set(employees.map((e) => e.department)))];

  const filtered = employees.filter((e) => {
    const matchSearch =
      e.full_name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const riskColor = (risk?: number) => {
    if (!risk) return "#5c5c80";
    if (risk >= 50) return "#ef4444";
    if (risk >= 30) return "#f59e0b";
    return "#22c55e";
  };

  const tenure = (joinDate: string) => {
    const months = Math.floor(
      (Date.now() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    if (months >= 12) return `${Math.floor(months / 12)}y ${months % 12}m`;
    return `${months}m`;
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Syne, sans-serif", background: "linear-gradient(135deg, #14b8a6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Employee Directory
          </h1>
          <p className="text-[#9494b8] text-sm">{employees.filter((e) => e.status === "active").length} active employees</p>
        </div>
        <Button variant="hr">
          <Plus size={14} />
          Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Headcount", value: employees.length, icon: Users, color: "#14b8a6" },
          { label: "Avg Performance", value: `${Math.round(employees.reduce((a, e) => a + (e.performance_score || 0), 0) / employees.length)}/100`, icon: Star, color: "#22c55e" },
          { label: "High Attrition Risk", value: employees.filter((e) => (e.attrition_risk || 0) >= 50).length, icon: AlertTriangle, color: "#ef4444" },
          { label: "On Leave", value: employees.filter((e) => e.status === "on_leave").length, icon: Calendar, color: "#f59e0b" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="w-8 h-8 rounded-[8px] flex items-center justify-center mb-2" style={{ background: `${s.color}18` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <div className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "Syne, sans-serif" }}>
              {s.value}
            </div>
            <div className="text-xs text-[#9494b8]">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <Input
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2 overflow-x-auto">
          {depts.map((d) => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-1.5 rounded-[8px] text-xs whitespace-nowrap transition-all ${
                deptFilter === d
                  ? "bg-[rgba(20,184,166,0.15)] text-[#14b8a6] border border-[rgba(20,184,166,0.3)]"
                  : "bg-[#0d0d1a] border border-[#1e1e35] text-[#9494b8] hover:text-[#e2e2f0]"
              }`}
            >
              {d === "all" ? "All Departments" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((emp) => (
          <Card
            key={emp.id}
            className="p-5 cursor-pointer hover:border-[rgba(20,184,166,0.3)] transition-all group"
            onClick={() => setSelected(emp)}
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={emp.full_name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#e2e2f0] truncate" style={{ fontFamily: "Syne, sans-serif" }}>
                    {emp.full_name}
                  </span>
                  <Badge variant={STATUS_COLORS[emp.status]} size="sm">
                    {emp.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-xs text-[#9494b8] truncate">{emp.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[10px] font-medium"
                style={{
                  background: `${DEPT_COLORS[emp.department] || "#6366f1"}15`,
                  color: DEPT_COLORS[emp.department] || "#6366f1",
                }}
              >
                <Briefcase size={9} />
                {emp.department}
              </div>
              <span className="text-[10px] text-[#5c5c80]">Tenure: {tenure(emp.join_date)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#12121f] rounded-[8px] p-2 text-center">
                <div className="text-sm font-bold text-[#22c55e]" style={{ fontFamily: "Syne, sans-serif" }}>
                  {emp.performance_score}
                </div>
                <div className="text-[9px] text-[#5c5c80]">Perf Score</div>
              </div>
              <div className="bg-[#12121f] rounded-[8px] p-2 text-center">
                <div className="text-sm font-bold" style={{ color: riskColor(emp.attrition_risk), fontFamily: "Syne, sans-serif" }}>
                  {emp.attrition_risk}%
                </div>
                <div className="text-[9px] text-[#5c5c80]">Attrition Risk</div>
              </div>
              <div className="bg-[#12121f] rounded-[8px] p-2 text-center">
                <div className="text-sm font-bold text-[#818cf8]" style={{ fontFamily: "Syne, sans-serif" }}>
                  ${Math.round(emp.salary / 1000)}k
                </div>
                <div className="text-[9px] text-[#5c5c80]">Salary</div>
              </div>
            </div>

            {(emp.attrition_risk || 0) >= 50 && (
              <div className="mt-3 flex items-start gap-1.5 p-2 bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] rounded-[8px]">
                <AlertTriangle size={10} className="text-[#ef4444] mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-[#ef4444]">High attrition risk — review engagement</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Employee Detail Modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected.full_name} size="lg">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={selected.full_name} size="lg" />
              <div>
                <div className="text-sm text-[#9494b8]">{selected.role} · {selected.department}</div>
                <div className="text-xs text-[#5c5c80] mt-0.5">Joined {new Date(selected.join_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
                <div className="text-xs text-[#5c5c80]">{selected.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Performance", value: `${selected.performance_score}/100`, color: "#22c55e" },
                { label: "Attrition Risk", value: `${selected.attrition_risk}%`, color: riskColor(selected.attrition_risk) },
                { label: "Salary", value: `$${selected.salary.toLocaleString()}`, color: "#818cf8" },
              ].map((s) => (
                <div key={s.label} className="bg-[#12121f] rounded-[10px] p-3 text-center">
                  <div className="text-lg font-bold" style={{ color: s.color, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
                  <div className="text-[10px] text-[#5c5c80]">{s.label}</div>
                </div>
              ))}
            </div>
            {(selected.attrition_risk || 0) >= 50 && (
              <div className="p-4 bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] rounded-[12px]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-[#ef4444]" />
                  <span className="text-sm font-semibold text-[#ef4444]">High Attrition Risk</span>
                </div>
                <p className="text-xs text-[#9494b8]">
                  AI analysis suggests this employee is at high risk of leaving. Consider: salary review, career conversation, or additional responsibilities.
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
