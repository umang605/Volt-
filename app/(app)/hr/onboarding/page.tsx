"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  FileText,
  Laptop,
  Users,
  Calendar,
} from "lucide-react";

const ONBOARDING_HIRES = [
  {
    id: "1",
    name: "Alex Kim",
    role: "Senior Backend Engineer",
    startDate: "2026-05-20",
    day: 1,
    phase: "Day 1" as const,
    tasks: {
      "Day 1": [
        { label: "Complete HR paperwork", done: true, icon: FileText },
        { label: "Set up laptop and accounts", done: true, icon: Laptop },
        { label: "Meet with manager", done: true, icon: Users },
        { label: "Review company handbook", done: false, icon: FileText },
      ],
      "Week 1": [
        { label: "Team introductions", done: false, icon: Users },
        { label: "Architecture walkthrough", done: false, icon: Laptop },
        { label: "First commit to codebase", done: false, icon: Zap },
        { label: "1:1 with team lead", done: false, icon: Calendar },
      ],
      "Month 1": [
        { label: "Ship first feature", done: false, icon: Zap },
        { label: "Complete security training", done: false, icon: FileText },
        { label: "30-day check-in with manager", done: false, icon: Users },
        { label: "Peer introductions across teams", done: false, icon: Users },
      ],
    },
  },
];

type Phase = "Day 1" | "Week 1" | "Month 1";
const PHASES: Phase[] = ["Day 1", "Week 1", "Month 1"];

export default function OnboardingPage() {
  const [hires, setHires] = useState(ONBOARDING_HIRES);
  const [selectedHire, setSelectedHire] = useState(ONBOARDING_HIRES[0]);
  const [activePhase, setActivePhase] = useState<Phase>("Day 1");

  const toggleTask = (hireId: string, phase: Phase, taskIndex: number) => {
    setHires((prev) =>
      prev.map((h) => {
        if (h.id !== hireId) return h;
        const updated = { ...h };
        updated.tasks = { ...updated.tasks };
        updated.tasks[phase] = updated.tasks[phase].map((t, i) =>
          i === taskIndex ? { ...t, done: !t.done } : t
        );
        return updated;
      })
    );
    if (selectedHire.id === hireId) {
      setSelectedHire((prev) => {
        const updated = { ...prev };
        updated.tasks = { ...updated.tasks };
        updated.tasks[phase] = updated.tasks[phase].map((t, i) =>
          i === taskIndex ? { ...t, done: !t.done } : t
        );
        return updated;
      });
    }
  };

  const completion = (hire: typeof ONBOARDING_HIRES[0]) => {
    const all = Object.values(hire.tasks).flat();
    const done = all.filter((t) => t.done).length;
    return Math.round((done / all.length) * 100);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", background: "linear-gradient(135deg, #14b8a6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Onboarding
          </h1>
          <p className="text-[#9494b8] text-sm">{hires.length} new hire{hires.length > 1 ? "s" : ""} in progress</p>
        </div>
      </div>

      {/* New hire cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {hires.map((hire) => {
          const pct = completion(hire);
          return (
            <Card
              key={hire.id}
              glow
              className={`p-4 cursor-pointer transition-all ${
                selectedHire.id === hire.id ? "border-[rgba(20,184,166,0.5)]" : ""
              }`}
              onClick={() => setSelectedHire(hire)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={hire.name} size="sm" />
                <div>
                  <div className="text-sm font-bold text-[#e2e2f0]" style={{ fontFamily: "Syne, sans-serif" }}>
                    {hire.name}
                  </div>
                  <div className="text-xs text-[#9494b8]">{hire.role}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#5c5c80]">
                  Starts {new Date(hire.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className="text-xs font-bold" style={{ color: pct === 100 ? "#22c55e" : "#14b8a6" }}>
                  {pct}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#1e1e35] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #14b8a6, #10b981)",
                  }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Checklist */}
      {selectedHire && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <Avatar name={selectedHire.name} size="md" />
            <div>
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                {selectedHire.name}&apos;s Onboarding
              </h2>
              <p className="text-sm text-[#9494b8]">{selectedHire.role}</p>
            </div>
          </div>

          {/* Phase tabs */}
          <div className="flex items-center gap-1 bg-[#12121f] rounded-[10px] p-1 w-fit mb-5">
            {PHASES.map((phase) => {
              const tasks = selectedHire.tasks[phase];
              const done = tasks.filter((t) => t.done).length;
              return (
                <button
                  key={phase}
                  onClick={() => setActivePhase(phase)}
                  className={`px-3 py-1.5 rounded-[7px] text-xs transition-all flex items-center gap-1.5 ${
                    activePhase === phase
                      ? "bg-[rgba(20,184,166,0.15)] text-[#14b8a6]"
                      : "text-[#5c5c80] hover:text-[#9494b8]"
                  }`}
                >
                  {phase}
                  <span
                    className="text-[9px] px-1 py-0.5 rounded-[4px]"
                    style={{
                      background: done === tasks.length ? "rgba(34,197,94,0.2)" : "rgba(92,92,128,0.2)",
                      color: done === tasks.length ? "#22c55e" : "#5c5c80",
                    }}
                  >
                    {done}/{tasks.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {selectedHire.tasks[activePhase].map((task, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-[10px] border cursor-pointer transition-all ${
                  task.done
                    ? "border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.04)]"
                    : "border-[#1e1e35] bg-[#12121f] hover:border-[rgba(20,184,166,0.3)]"
                }`}
                onClick={() => toggleTask(selectedHire.id, activePhase, i)}
              >
                {task.done ? (
                  <CheckCircle2 size={16} className="text-[#22c55e] flex-shrink-0" />
                ) : (
                  <Circle size={16} className="text-[#252540] flex-shrink-0" />
                )}
                <div
                  className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
                  style={{
                    background: task.done ? "rgba(34,197,94,0.1)" : "rgba(20,184,166,0.1)",
                  }}
                >
                  <task.icon size={13} style={{ color: task.done ? "#22c55e" : "#14b8a6" }} />
                </div>
                <span
                  className={`text-sm transition-all ${
                    task.done ? "text-[#5c5c80] line-through" : "text-[#e2e2f0]"
                  }`}
                >
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
