"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { JobRole } from "@/types";
import {
  Plus,
  Sparkles,
  Search,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Pause,
  ChevronRight,
  Brain,
  Target,
  ShieldAlert,
  Briefcase,
} from "lucide-react";
import { healthScoreColor, healthScoreLabel, formatRelativeTime } from "@/lib/utils";

const MOCK_ROLES: JobRole[] = [
  {
    id: "1",
    company_id: "c1",
    title: "Senior Backend Engineer",
    department: "Engineering",
    description: "We're building the infrastructure layer...",
    requirements: ["5+ years Go/Python", "Distributed systems", "AWS/GCP"],
    salary_min: 140000,
    salary_max: 180000,
    location: "San Francisco, CA",
    remote: true,
    status: "open",
    priority: "high",
    health_score: 85,
    urgency_score: 72,
    difficulty_score: 65,
    avg_days_to_fill: 38,
    ai_summary: "High-impact infra role — attract builders, not maintainers",
    interview_questions: ["Walk me through the most complex system you've built from scratch", "How do you handle cascading failures?"],
    ideal_candidate_profile: "Systems thinker who loves ownership. Has strong opinions but changes them with evidence.",
    top_risks: ["Market is competitive — move fast", "Salary range may be below market"],
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    company_id: "c1",
    title: "Product Designer",
    department: "Design",
    description: "Shape the visual and interaction language...",
    requirements: ["4+ years product design", "Figma expert", "Design systems"],
    salary_min: 110000,
    salary_max: 145000,
    location: "Remote",
    remote: true,
    status: "open",
    priority: "medium",
    health_score: 62,
    urgency_score: 55,
    difficulty_score: 50,
    avg_days_to_fill: 42,
    ai_summary: "Creative lead role — needs portfolio-first screening",
    interview_questions: ["Show us something you're proud of that nobody asked you to build"],
    ideal_candidate_profile: "Opinionated designer who can defend every pixel decision with user data.",
    top_risks: ["High application volume, low signal", "Portfolio screening takes time"],
    created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    company_id: "c1",
    title: "Data Scientist",
    department: "Data",
    description: "Turn messy data into business intelligence...",
    requirements: ["Python/R expertise", "ML fundamentals", "SQL mastery"],
    salary_min: 130000,
    salary_max: 165000,
    location: "New York, NY",
    remote: false,
    status: "open",
    priority: "urgent",
    health_score: 91,
    urgency_score: 88,
    difficulty_score: 70,
    avg_days_to_fill: 35,
    ai_summary: "Urgent revenue-critical role — board-level visibility",
    interview_questions: ["Describe a model you built that surprised you with its results"],
    ideal_candidate_profile: "Curious problem-solver who communicates insights in plain English.",
    top_risks: ["Must be NYC-based — narrows pool significantly"],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    company_id: "c1",
    title: "Frontend Lead",
    department: "Engineering",
    description: "Lead the frontend chapter...",
    requirements: ["React expert", "5+ years", "Leadership experience"],
    salary_min: 145000,
    salary_max: 175000,
    location: "Remote",
    remote: true,
    status: "open",
    priority: "high",
    health_score: 31,
    urgency_score: 80,
    difficulty_score: 75,
    avg_days_to_fill: 58,
    ai_summary: "Pipeline is stalling — needs urgent intervention",
    interview_questions: ["How do you approach tech debt while shipping features?"],
    ideal_candidate_profile: "Technical leader who codes. Mentors naturally, ships constantly.",
    top_risks: ["45 days open — candidates may see this as a flag", "Low pipeline velocity"],
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const priorityColors: Record<string, "danger" | "warning" | "volt" | "default"> = {
  urgent: "danger",
  high: "warning",
  medium: "volt",
  low: "default",
};

export default function RolesPage() {
  const supabase = createClient();
  const [roles, setRoles] = useState<JobRole[]>(MOCK_ROLES);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [creating, setCreating] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [newRoleDept, setNewRoleDept] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedJD, setGeneratedJD] = useState<Partial<JobRole> | null>(null);

  const filtered = roles.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
  );

  const generateJD = async () => {
    if (!newRoleTitle.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newRoleTitle, department: newRoleDept }),
      });
      const data = await res.json();
      setGeneratedJD(data);
    } catch {
      // Fallback mock
      setGeneratedJD({
        description: `We're looking for an exceptional ${newRoleTitle} to join our team. You'll be working on high-impact problems that directly affect our product and business outcomes. This isn't a maintenance role — you'll be building from scratch, owning outcomes, and setting the standard for the team.\n\nYou'll work alongside a small, senior team that moves fast without cutting corners. We value clarity of thought over years of experience.`,
        requirements: ["3+ years of relevant experience", "Strong communication skills", "Ownership mindset", "Track record of shipping"],
        urgency_score: 65,
        difficulty_score: 55,
        avg_days_to_fill: 42,
        salary_min: 100000,
        salary_max: 140000,
        interview_questions: [
          "Tell me about the project you're most proud of — what made it hard?",
          "How do you prioritize when everything feels urgent?",
          "What's something you disagree with most teams about?",
        ],
        ideal_candidate_profile: "Self-driven executor who communicates clearly and takes ownership without being asked.",
        top_risks: ["Broad role definition may attract generalists", "Interview loop needs to be tight"],
        ai_summary: `High-potential role — clarity on scope will determine quality of applicants`,
      });
    } finally {
      setGenerating(false);
    }
  };

  const saveRole = () => {
    if (!generatedJD) return;
    const newRole: JobRole = {
      id: Date.now().toString(),
      company_id: "c1",
      title: newRoleTitle,
      department: newRoleDept || "General",
      description: generatedJD.description || "",
      requirements: generatedJD.requirements || [],
      salary_min: generatedJD.salary_min || 80000,
      salary_max: generatedJD.salary_max || 120000,
      location: "Remote",
      remote: true,
      status: "open",
      priority: "medium",
      health_score: 75,
      urgency_score: generatedJD.urgency_score || 50,
      difficulty_score: generatedJD.difficulty_score || 50,
      avg_days_to_fill: generatedJD.avg_days_to_fill || 42,
      ai_summary: generatedJD.ai_summary,
      interview_questions: generatedJD.interview_questions,
      ideal_candidate_profile: generatedJD.ideal_candidate_profile,
      top_risks: generatedJD.top_risks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setRoles([newRole, ...roles]);
    setCreating(false);
    setGeneratedJD(null);
    setNewRoleTitle("");
    setNewRoleDept("");
    setSelectedRole(newRole);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
            Roles
          </h1>
          <p className="text-[#9494b8] text-sm">{roles.filter((r) => r.status === "open").length} open positions</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus size={14} />
          Create Role
        </Button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <Input
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Role List */}
        <div className="xl:col-span-2 space-y-3">
          {filtered.map((role) => (
            <Card
              key={role.id}
              glow
              onClick={() => setSelectedRole(role)}
              className={`p-4 cursor-pointer transition-all ${
                selectedRole?.id === role.id
                  ? "border-[rgba(99,102,241,0.5)] bg-[rgba(99,102,241,0.05)]"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: healthScoreColor(role.health_score) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#e2e2f0] truncate" style={{ fontFamily: "Syne, sans-serif" }}>
                      {role.title}
                    </span>
                    <Badge variant={priorityColors[role.priority]} size="sm">
                      {role.priority}
                    </Badge>
                  </div>
                  <div className="text-xs text-[#9494b8] mb-2">{role.department}</div>
                  {role.ai_summary && (
                    <div className="flex items-start gap-1.5 p-2 bg-[rgba(99,102,241,0.06)] rounded-[8px]">
                      <Sparkles size={10} className="text-[#818cf8] mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-[#818cf8] leading-relaxed">{role.ai_summary}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={10} className="text-[#5c5c80]" />
                      <span className="text-[10px] text-[#5c5c80]">
                        Health:{" "}
                        <span style={{ color: healthScoreColor(role.health_score) }}>
                          {role.health_score}%
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-[#5c5c80]" />
                      <span className="text-[10px] text-[#5c5c80]">
                        {Math.floor((Date.now() - new Date(role.created_at).getTime()) / (1000 * 60 * 60 * 24))}d open
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-[#5c5c80] flex-shrink-0 mt-0.5" />
              </div>
            </Card>
          ))}
        </div>

        {/* Role Detail */}
        <div className="xl:col-span-3">
          {selectedRole ? (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                      {selectedRole.title}
                    </h2>
                    <Badge variant={priorityColors[selectedRole.priority]}>
                      {selectedRole.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#9494b8]">
                    <span>{selectedRole.department}</span>
                    <span>·</span>
                    <span>{selectedRole.location}</span>
                    {selectedRole.remote && (
                      <>
                        <span>·</span>
                        <Badge variant="volt" size="sm">Remote OK</Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#e2e2f0]" style={{ fontFamily: "Syne, sans-serif" }}>
                    ${(selectedRole.salary_min / 1000).toFixed(0)}k–{(selectedRole.salary_max / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[10px] text-[#5c5c80]">Salary range</div>
                </div>
              </div>

              {/* Health metrics */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  {
                    label: "Health",
                    value: `${selectedRole.health_score}%`,
                    color: healthScoreColor(selectedRole.health_score),
                    icon: TrendingUp,
                  },
                  {
                    label: "Urgency",
                    value: `${selectedRole.urgency_score}%`,
                    color: selectedRole.urgency_score > 70 ? "#ef4444" : "#f59e0b",
                    icon: AlertTriangle,
                  },
                  {
                    label: "Avg Fill",
                    value: `${selectedRole.avg_days_to_fill}d`,
                    color: "#818cf8",
                    icon: Clock,
                  },
                ].map((m) => (
                  <div key={m.label} className="bg-[#12121f] rounded-[10px] p-3 text-center">
                    <m.icon size={14} style={{ color: m.color }} className="mx-auto mb-1" />
                    <div className="text-sm font-bold" style={{ color: m.color, fontFamily: "Syne, sans-serif" }}>
                      {m.value}
                    </div>
                    <div className="text-[10px] text-[#5c5c80]">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              {selectedRole.ai_summary && (
                <div className="flex items-start gap-2 p-3 bg-[rgba(99,102,241,0.06)] border border-[rgba(99,102,241,0.15)] rounded-[10px] mb-4">
                  <Sparkles size={13} className="text-[#818cf8] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#818cf8]">{selectedRole.ai_summary}</p>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-[#9494b8] uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-sm text-[#e2e2f0] leading-relaxed">{selectedRole.description}</p>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-[#9494b8] uppercase tracking-wider mb-2">
                  Requirements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.requirements.map((req, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-[#1a1a2e] border border-[#252540] rounded-[6px] text-[#9494b8]"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interview Questions */}
              {selectedRole.interview_questions?.length ? (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-[#9494b8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Brain size={12} />
                    Top Interview Questions
                  </h3>
                  <div className="space-y-2">
                    {selectedRole.interview_questions.map((q, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#e2e2f0]">
                        <span className="text-[#6366f1] font-bold flex-shrink-0">{i + 1}.</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Ideal Candidate */}
              {selectedRole.ideal_candidate_profile && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-[#9494b8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Target size={12} />
                    Ideal Candidate Profile
                  </h3>
                  <p className="text-xs text-[#e2e2f0] leading-relaxed bg-[#12121f] p-3 rounded-[10px]">
                    {selectedRole.ideal_candidate_profile}
                  </p>
                </div>
              )}

              {/* Top Risks */}
              {selectedRole.top_risks?.length ? (
                <div>
                  <h3 className="text-xs font-semibold text-[#9494b8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert size={12} />
                    Risks & Time Wasters
                  </h3>
                  <div className="space-y-1.5">
                    {selectedRole.top_risks.map((risk, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#f59e0b]">
                        <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </Card>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center text-center h-64">
              <Briefcase size={32} className="text-[#252540] mb-3" />
              <p className="text-[#5c5c80] text-sm">Select a role to view details</p>
            </Card>
          )}
        </div>
      </div>

      {/* Create Role Modal */}
      <Modal
        open={creating}
        onClose={() => { setCreating(false); setGeneratedJD(null); }}
        title={generatedJD ? "Review & Save Role" : "Create Role with AI"}
        size="lg"
      >
        {!generatedJD ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-[rgba(99,102,241,0.06)] border border-[rgba(99,102,241,0.15)] rounded-[10px]">
              <Zap size={14} className="text-[#818cf8] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#818cf8]">
                Paste a job title and VOLT AI will generate a complete, compelling JD with interview questions, ideal candidate profile, risks, and salary benchmarks.
              </p>
            </div>
            <Input
              label="Job Title"
              placeholder="e.g. Senior Backend Engineer"
              value={newRoleTitle}
              onChange={(e) => setNewRoleTitle(e.target.value)}
            />
            <Input
              label="Department (optional)"
              placeholder="e.g. Engineering"
              value={newRoleDept}
              onChange={(e) => setNewRoleDept(e.target.value)}
            />
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                loading={generating}
                onClick={generateJD}
                disabled={!newRoleTitle.trim()}
              >
                <Sparkles size={14} />
                Generate with AI
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="flex items-center gap-2 p-3 bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.2)] rounded-[10px]">
              <CheckCircle2 size={14} className="text-[#22c55e]" />
              <span className="text-xs text-[#22c55e]">AI-generated JD ready to review</span>
            </div>

            <div>
              <h4 className="text-xs text-[#9494b8] uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-[#e2e2f0] leading-relaxed bg-[#12121f] p-3 rounded-[10px]">
                {generatedJD.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs text-[#9494b8] uppercase tracking-wider mb-2">Requirements</h4>
              <div className="flex flex-wrap gap-2">
                {generatedJD.requirements?.map((r, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-[#1a1a2e] border border-[#252540] rounded-[6px] text-[#9494b8]">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#12121f] rounded-[10px] p-3">
                <div className="text-xs text-[#5c5c80] mb-1">Salary Range</div>
                <div className="text-sm font-bold text-[#e2e2f0]" style={{ fontFamily: "Syne, sans-serif" }}>
                  ${generatedJD.salary_min?.toLocaleString()} – ${generatedJD.salary_max?.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#12121f] rounded-[10px] p-3">
                <div className="text-xs text-[#5c5c80] mb-1">Avg Days to Fill</div>
                <div className="text-sm font-bold text-[#e2e2f0]" style={{ fontFamily: "Syne, sans-serif" }}>
                  {generatedJD.avg_days_to_fill} days
                </div>
              </div>
            </div>

            {generatedJD.interview_questions?.length ? (
              <div>
                <h4 className="text-xs text-[#9494b8] uppercase tracking-wider mb-2">Top Interview Questions</h4>
                {generatedJD.interview_questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#e2e2f0] mb-2">
                    <span className="text-[#6366f1] font-bold flex-shrink-0">{i + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex gap-3 pt-2 sticky bottom-0 bg-[#0d0d1a] pb-1">
              <Button variant="secondary" className="flex-1" onClick={() => setGeneratedJD(null)}>
                Regenerate
              </Button>
              <Button className="flex-1" onClick={saveRole}>
                <CheckCircle2 size={14} />
                Save Role
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
