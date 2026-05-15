"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Download,
  Play,
  Sparkles,
} from "lucide-react";

interface PayrollEntry {
  id: string;
  employee: string;
  dept: string;
  base: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: "draft" | "processed" | "paid";
  anomaly: string | null;
}

const PAYROLL_DATA: PayrollEntry[] = [
  {
    id: "1",
    employee: "Arjun Mehta",
    dept: "Engineering",
    base: 145000 / 12,
    bonus: 2000,
    deductions: 1200,
    netPay: 145000 / 12 + 2000 - 1200,
    status: "processed" as const,
    anomaly: null,
  },
  {
    id: "2",
    employee: "Priya Sharma",
    dept: "Product",
    base: 135000 / 12,
    bonus: 0,
    deductions: 1100,
    netPay: 135000 / 12 - 1100,
    status: "processed" as const,
    anomaly: null,
  },
  {
    id: "3",
    employee: "Ravi Kumar",
    dept: "Engineering",
    base: 130000 / 12,
    bonus: 5500,
    deductions: 1050,
    netPay: 130000 / 12 + 5500 - 1050,
    status: "draft" as const,
    anomaly: "Overtime this month is 40% higher than last month — verify before processing",
  },
  {
    id: "4",
    employee: "Neha Patel",
    dept: "Design",
    base: 115000 / 12,
    bonus: 0,
    deductions: 900,
    netPay: 115000 / 12 - 900,
    status: "paid" as const,
    anomaly: null,
  },
  {
    id: "5",
    employee: "Anand Krishnan",
    dept: "Data",
    base: 110000 / 12,
    bonus: 0,
    deductions: 880,
    netPay: 110000 / 12 - 880,
    status: "draft" as const,
    anomaly: null,
  },
];

const STATUS_BADGE: Record<string, "success" | "warning" | "volt" | "default"> = {
  paid: "success",
  processed: "volt",
  draft: "default",
};

const STATUS_LABEL: Record<string, string> = {
  paid: "Paid",
  processed: "Processed",
  draft: "Draft",
};

export default function PayrollPage() {
  const [payroll, setPayroll] = useState(PAYROLL_DATA);
  const [runningPayroll, setRunningPayroll] = useState(false);

  const totalPayroll = payroll.reduce((sum, e) => sum + e.netPay, 0);
  const anomalies = payroll.filter((e) => e.anomaly);
  const drafts = payroll.filter((e) => e.status === "draft");

  const runPayroll = async () => {
    setRunningPayroll(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPayroll((prev) =>
      prev.map((e) => (e.status === "draft" ? { ...e, status: "processed" as const } : e))
    );
    setRunningPayroll(false);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", background: "linear-gradient(135deg, #14b8a6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Payroll Intelligence
          </h1>
          <p className="text-muted text-sm">May 2026 · {drafts.length} drafts pending</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <Download size={14} />
            Export
          </Button>
          <Button
            variant="primary"
            loading={runningPayroll}
            onClick={runPayroll}
            disabled={drafts.length === 0}
          >
            <Play size={14} />
            Run Payroll ({drafts.length})
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Payroll", value: `$${Math.round(totalPayroll / 1000)}k`, color: "#14b8a6" },
          { label: "Avg Salary/mo", value: `$${Math.round(totalPayroll / payroll.length / 1000)}k`, color: "#10b981" },
          { label: "AI Anomalies", value: anomalies.length, color: anomalies.length > 0 ? "#f59e0b" : "#22c55e" },
          { label: "Pending Drafts", value: drafts.length, color: drafts.length > 0 ? "#818cf8" : "#22c55e" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: "Syne, sans-serif" }}>
              {s.value}
            </div>
            <div className="text-xs text-muted">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Anomaly Alert */}
      {anomalies.length > 0 && (
        <div className="mb-5 p-4 bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)] rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#f59e0b]" />
            <span className="text-sm font-semibold text-[#f59e0b]">AI Detected {anomalies.length} Anomal{anomalies.length > 1 ? "ies" : "y"}</span>
          </div>
          {anomalies.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertTriangle size={12} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#f59e0b]">
                <strong>{a.employee}:</strong> {a.anomaly}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Payroll Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline">
                {["Employee", "Base Salary", "Bonus", "Deductions", "Net Pay", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left p-4 text-xs text-muted-soft uppercase tracking-wider font-medium"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {payroll.map((row) => (
                <>
                  <tr
                    key={row.id}
                    className="border-b border-hairline hover:bg-surface-card transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={row.employee} size="sm" />
                        <div>
                          <div className="text-sm font-medium text-ink" >
                            {row.employee}
                          </div>
                          <div className="text-[10px] text-muted-soft">{row.dept}</div>
                        </div>
                        {row.anomaly && (
                          <AlertTriangle size={12} className="text-[#f59e0b] ml-1" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted">
                      ${Math.round(row.base).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-[#22c55e]">
                      {row.bonus > 0 ? `+$${row.bonus.toLocaleString()}` : "—"}
                    </td>
                    <td className="p-4 text-sm text-[#ef4444]">
                      -${row.deductions.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-bold text-ink" >
                      ${Math.round(row.netPay).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Badge variant={STATUS_BADGE[row.status]}>
                        {STATUS_LABEL[row.status]}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        <Download size={12} />
                        Payslip
                      </Button>
                    </td>
                  </tr>
                  {row.anomaly && (
                    <tr className="border-b border-hairline">
                      <td colSpan={7} className="px-4 py-2">
                        <div className="flex items-start gap-2 px-3 py-2 bg-[rgba(245,158,11,0.06)] rounded-md">
                          <AlertTriangle size={11} className="text-[#f59e0b] mt-0.5" />
                          <p className="text-[10px] text-[#f59e0b]">{row.anomaly}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-card">
                <td colSpan={3} className="p-4 text-xs text-muted font-medium uppercase tracking-wider">
                  Total
                </td>
                <td className="p-4 text-sm text-[#ef4444] font-bold">
                  -${payroll.reduce((s, e) => s + e.deductions, 0).toLocaleString()}
                </td>
                <td className="p-4 text-base font-bold text-ink" >
                  ${Math.round(totalPayroll).toLocaleString()}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
