"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Sparkles,
  Brain,
  CheckCircle2,
  Plus,
  ChevronRight,
  Star,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface InterviewRecord {
  id: string;
  candidateName: string;
  roleTitle: string;
  scheduledAt: string;
  duration: number;
  format: "video" | "phone" | "in_person";
  status: "scheduled" | "completed" | "cancelled";
  interviewers: string[];
  aiGuide: string | null;
  debriefNotes?: string;
  decisionConfidence?: number;
}

const MOCK_INTERVIEWS: InterviewRecord[] = [
  {
    id: "1",
    candidateName: "Aisha Patel",
    roleTitle: "Data Scientist",
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    format: "video" as const,
    status: "scheduled" as const,
    interviewers: ["Sarah Chen", "James Okoro"],
    aiGuide: null,
  },
  {
    id: "2",
    candidateName: "Maya Okonkwo",
    roleTitle: "Data Scientist",
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    format: "video" as const,
    status: "scheduled" as const,
    interviewers: ["Priya Nair"],
    aiGuide: null,
  },
  {
    id: "3",
    candidateName: "Jordan Lee",
    roleTitle: "Product Designer",
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    format: "video" as const,
    status: "completed" as const,
    interviewers: ["Sarah Chen"],
    debriefNotes: "Strong portfolio. Articulate about design decisions. Some gaps in accessibility knowledge.",
    decisionConfidence: 72,
    aiGuide: `**Opening (2 min)**\nWarm up with their design journey. Ask what drew them to product design over other creative fields.

**Experience Deep-Dive**\n1. Walk me through a project where you had to push back on a stakeholder's request. What happened?\n2. Show me a design decision you're not proud of — what would you do differently?\n3. How do you decide when something is "done enough" to ship?

**Role-Specific Scenarios**\n1. We're redesigning our candidate card experience. Where do you start?\n2. The engineering team says your design is technically complex. How do you proceed?

**Red Flags to Watch**\n- Vague about process, heavy on aesthetics\n- Can't discuss tradeoffs they made\n- No user research experience

**Closing**\n- What questions do you have about our design culture?`,
  },
];

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
  const [selected, setSelected] = useState<typeof MOCK_INTERVIEWS[0] | null>(null);
  const [loadingGuide, setLoadingGuide] = useState(false);
  const [debriefOpen, setDebriefOpen] = useState(false);
  const [debriefNotes, setDebriefNotes] = useState("");
  const [debriefScore, setDebriefScore] = useState(0);
  const [analyzingDebrief, setAnalyzingDebrief] = useState(false);

  const upcoming = interviews.filter((i) => i.status === "scheduled");
  const completed = interviews.filter((i) => i.status === "completed");

  const generateGuide = async (interview: typeof MOCK_INTERVIEWS[0]) => {
    setLoadingGuide(true);
    try {
      const res = await fetch("/api/ai/interview-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: interview.candidateName,
          roleTitle: interview.roleTitle,
          candidateBackground: "Experienced professional applying for this role",
          roleRequirements: ["Relevant experience", "Technical skills", "Communication"],
        }),
      });
      const data = await res.json();
      setInterviews((prev) =>
        prev.map((i) => (i.id === interview.id ? { ...i, aiGuide: data.guide } : i))
      );
      setSelected((prev) => (prev ? { ...prev, aiGuide: data.guide } : null));
    } catch {
      const fallback = `**Opening (2 min)**\nStart with their background and what drew them to this opportunity.

**Experience Deep-Dive**\n1. What's the most impactful project you've shipped? What made it hard?\n2. Tell me about a time you had to change course mid-project.\n3. How do you handle ambiguity when requirements are unclear?

**Role-Specific Scenarios**\n1. Walk me through how you'd approach your first 30 days in this role.\n2. What does "great work" look like to you in this position?

**Red Flags to Watch**\n- Vague answers about impact\n- Inability to give specific examples\n- No questions about the team or culture

**Closing Questions to Ask**\n- What does success look like in the first 6 months?\n- How does the team handle disagreements on direction?`;
      setInterviews((prev) =>
        prev.map((i) => (i.id === interview.id ? { ...i, aiGuide: fallback } : i))
      );
      setSelected((prev) => (prev ? { ...prev, aiGuide: fallback } : null));
    } finally {
      setLoadingGuide(false);
    }
  };

  const formatIcons = {
    video: Video,
    phone: Phone,
    in_person: MapPin,
  };

  const statusColors = {
    scheduled: "volt" as const,
    completed: "success" as const,
    cancelled: "danger" as const,
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1" >
            Interviews
          </h1>
          <p className="text-body text-sm">
            {upcoming.length} upcoming · {completed.length} completed
          </p>
        </div>
        <Button>
          <Plus size={14} />
          Schedule Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Interview List */}
        <div className="xl:col-span-2 space-y-5">
          {/* Upcoming */}
          <div>
            <h2 className="text-xs font-semibold text-body uppercase tracking-wider mb-3 px-1">
              Upcoming
            </h2>
            <div className="space-y-3">
              {upcoming.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  selected={selected?.id === interview.id}
                  onClick={() => setSelected(interview)}
                  statusColors={statusColors}
                  formatIcons={formatIcons}
                />
              ))}
            </div>
          </div>

          {/* Completed */}
          <div>
            <h2 className="text-xs font-semibold text-body uppercase tracking-wider mb-3 px-1">
              Completed
            </h2>
            <div className="space-y-3">
              {completed.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  selected={selected?.id === interview.id}
                  onClick={() => setSelected(interview)}
                  statusColors={statusColors}
                  formatIcons={formatIcons}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-3">
          {selected ? (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Avatar name={selected.candidateName} size="md" />
                  <div>
                    <h2 className="text-lg font-bold text-ink" >
                      {selected.candidateName}
                    </h2>
                    <p className="text-sm text-body">{selected.roleTitle}</p>
                  </div>
                </div>
                <Badge variant={statusColors[selected.status]}>{selected.status}</Badge>
              </div>

              {/* Interview meta */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  {
                    icon: Calendar,
                    label: "Date",
                    value: formatDate(selected.scheduledAt),
                    color: "#818cf8",
                  },
                  {
                    icon: Clock,
                    label: "Duration",
                    value: `${selected.duration} min`,
                    color: "#a855f7",
                  },
                  {
                    icon: formatIcons[selected.format],
                    label: "Format",
                    value: selected.format === "in_person" ? "In Person" : selected.format.charAt(0).toUpperCase() + selected.format.slice(1),
                    color: "#6366f1",
                  },
                ].map((m) => (
                  <div key={m.label} className="bg-surface-soft rounded-[10px] p-3 text-center">
                    <m.icon size={14} style={{ color: m.color }} className="mx-auto mb-1" />
                    <div className="text-xs font-bold text-ink" >
                      {m.value}
                    </div>
                    <div className="text-[10px] text-mute">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Interviewers */}
              <div className="mb-5">
                <h3 className="text-xs text-body uppercase tracking-wider mb-2">Interviewers</h3>
                <div className="flex items-center gap-2">
                  {selected.interviewers.map((name) => (
                    <div key={name} className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-soft rounded-[8px]">
                      <Avatar name={name} size="xs" />
                      <span className="text-xs text-body">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision confidence (completed only) */}
              {selected.status === "completed" && selected.decisionConfidence && (
                <div className="mb-5 p-4 bg-surface-soft rounded-[12px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-body uppercase tracking-wider">Decision Confidence</span>
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: "Syne, sans-serif",
                        color: selected.decisionConfidence >= 70 ? "#22c55e" : selected.decisionConfidence >= 50 ? "#f59e0b" : "#ef4444",
                      }}
                    >
                      {selected.decisionConfidence}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#1e1e35] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${selected.decisionConfidence}%`,
                        background: selected.decisionConfidence >= 70 ? "#22c55e" : selected.decisionConfidence >= 50 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                  {selected.debriefNotes && (
                    <div className="mt-3 pt-3 border-t border-hairline">
                      <p className="text-xs text-body leading-relaxed">{selected.debriefNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* AI Interview Guide */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs text-body uppercase tracking-wider flex items-center gap-1.5">
                    <Brain size={12} />
                    AI Interview Guide
                  </h3>
                  {!selected.aiGuide && (
                    <Button
                      size="sm"
                      variant="secondary"
                      loading={loadingGuide}
                      onClick={() => generateGuide(selected)}
                    >
                      <Sparkles size={12} />
                      Generate Guide
                    </Button>
                  )}
                </div>

                {selected.aiGuide ? (
                  <div className="bg-surface-soft rounded-[12px] p-4 text-xs text-ink leading-relaxed whitespace-pre-wrap">
                    {selected.aiGuide}
                  </div>
                ) : (
                  <div className="border border-dashed border-hairline rounded-[12px] p-6 text-center">
                    <Brain size={24} className="text-[#252540] mx-auto mb-2" />
                    <p className="text-xs text-mute">
                      Generate an AI-tailored interview guide for this candidate
                    </p>
                  </div>
                )}
              </div>

              {selected.status === "scheduled" && (
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => { setDebriefOpen(true); }}
                  >
                    Submit Debrief
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center text-center h-64">
              <Calendar size={32} className="text-[#252540] mb-3" />
              <p className="text-mute text-sm">Select an interview to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function InterviewCard({
  interview,
  selected,
  onClick,
  statusColors,
  formatIcons,
}: {
  interview: any;
  selected: boolean;
  onClick: () => void;
  statusColors: Record<string, any>;
  formatIcons: Record<string, any>;
}) {
  const isPast = new Date(interview.scheduledAt) < new Date();
  const FormatIcon = formatIcons[interview.format];

  return (
    <Card
      hover
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all ${
        selected ? "border-[rgba(99,102,241,0.5)] bg-[rgba(99,102,241,0.04)]" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={interview.candidateName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-ink truncate" >
              {interview.candidateName}
            </span>
          </div>
          <div className="text-xs text-body truncate">{interview.roleTitle}</div>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <Calendar size={10} className="text-mute" />
              <span className="text-[10px] text-mute">
                {new Date(interview.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FormatIcon size={10} className="text-mute" />
              <span className="text-[10px] text-mute capitalize">{interview.format}</span>
            </div>
            <Badge variant={statusColors[interview.status]} size="sm">
              {interview.status}
            </Badge>
          </div>
        </div>
        <ChevronRight size={14} className="text-mute flex-shrink-0 mt-1" />
      </div>
    </Card>
  );
}
