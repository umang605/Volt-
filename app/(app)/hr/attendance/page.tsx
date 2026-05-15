"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const EMPLOYEES = [
  { id: "1", name: "Arjun Mehta", dept: "Engineering" },
  { id: "2", name: "Priya Sharma", dept: "Product" },
  { id: "3", name: "Ravi Kumar", dept: "Engineering" },
  { id: "4", name: "Neha Patel", dept: "Design" },
  { id: "5", name: "Anand Krishnan", dept: "Data" },
];

type AttendanceStatus = "present" | "absent" | "late" | "half_day" | "leave";

const generateWeekData = () => {
  const statuses: AttendanceStatus[] = ["present", "present", "present", "late", "half_day"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return EMPLOYEES.map((emp) => ({
    ...emp,
    week: days.map((day, i) => ({
      day,
      status: statuses[Math.floor(Math.random() * statuses.length)] as AttendanceStatus,
    })),
  }));
};

const WEEK_DATA = generateWeekData();

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string; bg: string; icon: any }> = {
  present: { label: "Present", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: CheckCircle2 },
  absent: { label: "Absent", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
  late: { label: "Late", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
  half_day: { label: "Half Day", color: "#818cf8", bg: "rgba(129,140,248,0.1)", icon: Clock },
  leave: { label: "On Leave", color: "#14b8a6", bg: "rgba(20,184,166,0.1)", icon: Calendar },
};

const LEAVE_REQUESTS = [
  { employee: "Neha Patel", type: "Annual Leave", dates: "May 15–19", days: 5, status: "pending" },
  { employee: "Ravi Kumar", type: "Sick Leave", dates: "May 13", days: 1, status: "approved" },
  { employee: "Anand Krishnan", type: "Annual Leave", dates: "May 26–30", days: 5, status: "pending" },
];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<"attendance" | "leaves">("attendance");
  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS);

  const approveLeave = (i: number) => {
    setLeaveRequests((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, status: "approved" } : l))
    );
  };

  const rejectLeave = (i: number) => {
    setLeaveRequests((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, status: "rejected" } : l))
    );
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", background: "linear-gradient(135deg, #14b8a6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Attendance & Leave
          </h1>
          <p className="text-[#9494b8] text-sm">Track team attendance and manage leave requests</p>
        </div>
        <Button variant="primary">Mark Attendance</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Present Today", value: "4/5", color: "#22c55e" },
          { label: "On Leave", value: "1", color: "#14b8a6" },
          { label: "Pending Requests", value: leaveRequests.filter((l) => l.status === "pending").length, color: "#f59e0b" },
          { label: "Avg Attendance", value: "94%", color: "#818cf8" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: "Syne, sans-serif" }}>
              {s.value}
            </div>
            <div className="text-xs text-[#9494b8]">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#0d0d1a] border border-[#1e1e35] rounded-[10px] p-1 w-fit mb-5">
        {(["attendance", "leaves"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-[7px] text-xs transition-all capitalize ${
              activeTab === tab
                ? "bg-[rgba(20,184,166,0.15)] text-[#14b8a6]"
                : "text-[#5c5c80] hover:text-[#9494b8]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "attendance" ? (
        <Card className="overflow-hidden">
          {/* Week navigation */}
          <div className="flex items-center justify-between p-4 border-b border-[#1e1e35]">
            <button className="p-1.5 rounded-[8px] hover:bg-[#1a1a2e] text-[#9494b8]">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-[#e2e2f0]" >
              May 12–16, 2026
            </span>
            <button className="p-1.5 rounded-[8px] hover:bg-[#1a1a2e] text-[#9494b8]">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Header */}
          <div className="grid grid-cols-[200px_repeat(5,1fr)] gap-0 border-b border-[#1e1e35]">
            <div className="p-3 text-xs text-[#5c5c80] uppercase tracking-wider">Employee</div>
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
              <div key={d} className="p-3 text-center text-xs text-[#5c5c80] uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Rows */}
          {WEEK_DATA.map((emp) => (
            <div
              key={emp.id}
              className="grid grid-cols-[200px_repeat(5,1fr)] border-b border-[#1e1e35] hover:bg-[#12121f] transition-colors"
            >
              <div className="p-3 flex items-center gap-2">
                <Avatar name={emp.name} size="xs" />
                <div>
                  <div className="text-xs font-medium text-[#e2e2f0]">{emp.name}</div>
                  <div className="text-[9px] text-[#5c5c80]">{emp.dept}</div>
                </div>
              </div>
              {emp.week.map((day) => {
                const config = STATUS_CONFIG[day.status];
                return (
                  <div key={day.day} className="p-3 flex items-center justify-center">
                    <div
                      className="w-7 h-7 rounded-[7px] flex items-center justify-center"
                      style={{ background: config.bg }}
                      title={config.label}
                    >
                      <config.icon size={12} style={{ color: config.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="p-4 flex items-center gap-4 flex-wrap">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <config.icon size={11} style={{ color: config.color }} />
                <span className="text-[10px] text-[#5c5c80]">{config.label}</span>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {leaveRequests.map((req, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={req.employee} size="sm" />
                  <div>
                    <div className="text-sm font-semibold text-[#e2e2f0]" >
                      {req.employee}
                    </div>
                    <div className="text-xs text-[#9494b8]">
                      {req.type} · {req.dates} · {req.days} day{req.days > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {req.status === "pending" ? (
                    <>
                      <Button size="sm" variant="danger" onClick={() => rejectLeave(i)}>
                        Reject
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => approveLeave(i)}>
                        Approve
                      </Button>
                    </>
                  ) : (
                    <Badge variant={req.status === "approved" ? "success" : "danger"}>
                      {req.status}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
