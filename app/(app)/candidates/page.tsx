"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import type { Candidate, CandidateStage } from "@/types";
import { PIPELINE_STAGES } from "@/types";
import {
  Plus,
  Search,
  Sparkles,
  Clock,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  User,
  Mail,
  Briefcase,
  Star,
  Brain,
  Upload,
  CheckCircle2,
  X,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "1", company_id: "c1", role_id: "1", full_name: "Marcus Webb",
    email: "marcus@email.com", current_title: "Staff Engineer", current_company: "Stripe",
    years_experience: 8, stage: "offer",
    ai_one_liner: "Thinks in systems, communicates in clarity — rare combination for infra roles.",
    ai_score: 92, predicted_ramp_weeks: 3, risk_flag: "Has 2 other offers pending — move fast",
    last_activity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2", company_id: "c1", role_id: "3", full_name: "Aisha Patel",
    email: "aisha@email.com", current_title: "Senior Data Scientist", current_company: "Netflix",
    years_experience: 6, stage: "interview",
    ai_one_liner: "Strong on experimentation, less proven on production ML systems.",
    ai_score: 78, predicted_ramp_weeks: 5, risk_flag: null,
    last_activity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3", company_id: "c1", role_id: "2", full_name: "Jordan Lee",
    email: "jordan@email.com", current_title: "Product Designer", current_company: "Figma",
    years_experience: 5, stage: "screened",
    ai_one_liner: "Portfolio shows taste. Hasn't led a design system end-to-end yet.",
    ai_score: 71, predicted_ramp_weeks: 6, risk_flag: "Expects senior title — discuss early",
    last_activity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4", company_id: "c1", role_id: "1", full_name: "Sam Torres",
    email: "sam@email.com", current_title: "Backend Engineer", current_company: "Shopify",
    years_experience: 4, stage: "applied",
    ai_one_liner: "Solid fundamentals. Needs to demonstrate distributed systems depth.",
    ai_score: 64, predicted_ramp_weeks: 8, risk_flag: null,
    last_activity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5", company_id: "c1", role_id: "4", full_name: "Riley Zhang",
    email: "riley@email.com", current_title: "Frontend Engineer", current_company: "Linear",
    years_experience: 7, stage: "applied",
    ai_one_liner: "Ship-first mentality. Builds fast, cleans up later — check for tech debt awareness.",
    ai_score: 80, predicted_ramp_weeks: 4, risk_flag: null,
    last_activity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6", company_id: "c1", role_id: "3", full_name: "Maya Okonkwo",
    email: "maya@email.com", current_title: "ML Engineer", current_company: "OpenAI",
    years_experience: 5, stage: "interview",
    ai_one_liner: "Deep ML expertise. Production experience at scale. Strong signal.",
    ai_score: 89, predicted_ramp_weeks: 3, risk_flag: "Currently fielding 4 other offers",
    last_activity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7", company_id: "c1", role_id: "1", full_name: "Alex Kim",
    email: "alex@email.com", current_title: "SRE", current_company: "Google",
    years_experience: 9, stage: "hired",
    ai_one_liner: "Rare infra-product hybrid. Will raise the bar for the entire team.",
    ai_score: 95, predicted_ramp_weeks: 2, risk_flag: null,
    last_activity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const STAGE_LABELS: Record<CandidateStage, string> = {
  applied: "Applied",
  screened: "Screened",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

const STAGE_COLORS: Record<CandidateStage, string> = {
  applied: "#5c5c80",
  screened: "#818cf8",
  interview: "#a855f7",
  offer: "#f59e0b",
  hired: "#22c55e",
  rejected: "#ef4444",
};

const KANBAN_STAGES: CandidateStage[] = ["applied", "screened", "interview", "offer", "hired"];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [addingCandidate, setAddingCandidate] = useState(false);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [newCandidate, setNewCandidate] = useState({
    full_name: "", email: "", current_title: "", current_company: "",
    years_experience: "3", stage: "applied" as CandidateStage,
  });

  const filtered = candidates.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.current_title?.toLowerCase().includes(search.toLowerCase()) ||
      c.current_company?.toLowerCase().includes(search.toLowerCase())
  );

  const byStage = (stage: CandidateStage) =>
    filtered.filter((c) => c.stage === stage);

  const moveStage = (candidateId: string, newStage: CandidateStage) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, stage: newStage, last_activity: new Date().toISOString() }
          : c
      )
    );
    if (selectedCandidate?.id === candidateId) {
      setSelectedCandidate((prev) => prev ? { ...prev, stage: newStage } : null);
    }
  };

  const addCandidate = () => {
    const c: Candidate = {
      id: Date.now().toString(),
      company_id: "c1",
      role_id: "1",
      ...newCandidate,
      years_experience: parseInt(newCandidate.years_experience) || 0,
      ai_one_liner: "New candidate — AI scoring pending",
      ai_score: undefined,
      predicted_ramp_weeks: undefined,
      risk_flag: null,
      last_activity: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    setCandidates([c, ...candidates]);
    setAddingCandidate(false);
    setNewCandidate({ full_name: "", email: "", current_title: "", current_company: "", years_experience: "3", stage: "applied" });
  };

  const scoreColor = (score?: number) =>
    !score ? "#5c5c80" : score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
            Candidates
          </h1>
          <p className="text-[#9494b8] text-sm">{candidates.length} total · {byStage("offer").length} in offer stage</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-[#0d0d1a] border border-[#1e1e35] rounded-[10px] p-1">
            {(["kanban", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded-[7px] text-xs transition-all ${
                  view === v ? "bg-[#1a1a2e] text-[#e2e2f0]" : "text-[#5c5c80] hover:text-[#9494b8]"
                }`}
              >
                {v === "kanban" ? "Kanban" : "List"}
              </button>
            ))}
          </div>
          <Button onClick={() => setAddingCandidate(true)}>
            <Plus size={14} />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <Input
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="max-w-sm"
        />
      </div>

      {view === "kanban" ? (
        /* Kanban Board */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_STAGES.map((stage) => {
            const stageCandidates = byStage(stage);
            return (
              <div key={stage} className="flex-shrink-0 w-72">
                {/* Stage Header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: STAGE_COLORS[stage] }}
                  />
                  <span className="text-xs font-semibold text-[#9494b8] uppercase tracking-wider">
                    {STAGE_LABELS[stage]}
                  </span>
                  <span
                    className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-[4px]"
                    style={{
                      background: `${STAGE_COLORS[stage]}20`,
                      color: STAGE_COLORS[stage],
                    }}
                  >
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {stageCandidates.map((c) => (
                    <CandidateCard
                      key={c.id}
                      candidate={c}
                      selected={selectedCandidate?.id === c.id}
                      onClick={() => setSelectedCandidate(c)}
                      onMove={moveStage}
                      stages={KANBAN_STAGES}
                      scoreColor={scoreColor}
                    />
                  ))}
                  {stageCandidates.length === 0 && (
                    <div className="border border-dashed border-[#1e1e35] rounded-[12px] h-20 flex items-center justify-center">
                      <span className="text-[10px] text-[#5c5c80]">No candidates</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card className="overflow-hidden">
          <div className="divide-y divide-[#1e1e35]">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-4 hover:bg-[#12121f] cursor-pointer transition-colors"
                onClick={() => setSelectedCandidate(c)}
              >
                <Avatar name={c.full_name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#e2e2f0]" style={{ fontFamily: "Syne, sans-serif" }}>
                      {c.full_name}
                    </span>
                    <div
                      className="text-[10px] px-1.5 py-0.5 rounded-[4px] font-medium"
                      style={{
                        background: `${STAGE_COLORS[c.stage]}20`,
                        color: STAGE_COLORS[c.stage],
                      }}
                    >
                      {STAGE_LABELS[c.stage]}
                    </div>
                  </div>
                  <div className="text-xs text-[#9494b8]">
                    {c.current_title} · {c.current_company}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {c.ai_score && (
                    <div className="text-sm font-bold" style={{ color: scoreColor(c.ai_score), fontFamily: "Syne, sans-serif" }}>
                      {c.ai_score}
                    </div>
                  )}
                  <div className="text-[10px] text-[#5c5c80]">{formatRelativeTime(c.last_activity)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <Modal
          open={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          title={selectedCandidate.full_name}
          size="lg"
        >
          <div className="space-y-5">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <Avatar name={selectedCandidate.full_name} size="lg" />
              <div className="flex-1">
                <div className="text-sm text-[#9494b8]">
                  {selectedCandidate.current_title} · {selectedCandidate.current_company}
                </div>
                <div className="text-xs text-[#5c5c80] mt-0.5">
                  {selectedCandidate.years_experience} years experience
                </div>
              </div>
              {selectedCandidate.ai_score && (
                <div className="text-center">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: scoreColor(selectedCandidate.ai_score), fontFamily: "Syne, sans-serif" }}
                  >
                    {selectedCandidate.ai_score}
                  </div>
                  <div className="text-[10px] text-[#5c5c80]">AI Score</div>
                </div>
              )}
            </div>

            {/* AI Insights */}
            {selectedCandidate.ai_one_liner && (
              <div className="flex items-start gap-2 p-3 bg-[rgba(99,102,241,0.06)] border border-[rgba(99,102,241,0.15)] rounded-[10px]">
                <Sparkles size={13} className="text-[#818cf8] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#818cf8]">{selectedCandidate.ai_one_liner}</p>
              </div>
            )}

            {/* Risk flag */}
            {selectedCandidate.risk_flag && (
              <div className="flex items-start gap-2 p-3 bg-[rgba(245,158,11,0.06)] border border-[rgba(245,158,11,0.2)] rounded-[10px]">
                <AlertTriangle size={13} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#f59e0b]">{selectedCandidate.risk_flag}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "AI Score",
                  value: selectedCandidate.ai_score ? `${selectedCandidate.ai_score}/100` : "—",
                  color: scoreColor(selectedCandidate.ai_score),
                },
                {
                  label: "Ramp Time",
                  value: selectedCandidate.predicted_ramp_weeks
                    ? `${selectedCandidate.predicted_ramp_weeks}w`
                    : "—",
                  color: "#818cf8",
                },
                {
                  label: "Last Active",
                  value: formatRelativeTime(selectedCandidate.last_activity),
                  color: "#9494b8",
                },
              ].map((s) => (
                <div key={s.label} className="bg-[#12121f] rounded-[10px] p-3 text-center">
                  <div className="text-sm font-bold" style={{ color: s.color, fontFamily: "Syne, sans-serif" }}>
                    {s.value}
                  </div>
                  <div className="text-[10px] text-[#5c5c80]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Stage mover */}
            <div>
              <h4 className="text-xs text-[#9494b8] uppercase tracking-wider mb-3">Move to Stage</h4>
              <div className="flex flex-wrap gap-2">
                {KANBAN_STAGES.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => moveStage(selectedCandidate.id, stage)}
                    className={`text-xs px-3 py-1.5 rounded-[8px] border transition-all ${
                      selectedCandidate.stage === stage
                        ? "border-transparent text-white"
                        : "border-[#1e1e35] text-[#9494b8] hover:border-[#252540] hover:text-[#e2e2f0]"
                    }`}
                    style={
                      selectedCandidate.stage === stage
                        ? { background: STAGE_COLORS[stage], borderColor: STAGE_COLORS[stage] }
                        : {}
                    }
                  >
                    {STAGE_LABELS[stage]}
                  </button>
                ))}
                <button
                  onClick={() => moveStage(selectedCandidate.id, "rejected")}
                  className="text-xs px-3 py-1.5 rounded-[8px] border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Candidate Modal */}
      <Modal open={addingCandidate} onClose={() => setAddingCandidate(false)} title="Add Candidate">
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Smith"
            value={newCandidate.full_name}
            onChange={(e) => setNewCandidate({ ...newCandidate, full_name: e.target.value })}
            icon={<User size={14} />}
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@example.com"
            value={newCandidate.email}
            onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
            icon={<Mail size={14} />}
          />
          <Input
            label="Current Title"
            placeholder="Senior Engineer"
            value={newCandidate.current_title}
            onChange={(e) => setNewCandidate({ ...newCandidate, current_title: e.target.value })}
            icon={<Briefcase size={14} />}
          />
          <Input
            label="Current Company"
            placeholder="Google"
            value={newCandidate.current_company}
            onChange={(e) => setNewCandidate({ ...newCandidate, current_company: e.target.value })}
          />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setAddingCandidate(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={addCandidate} disabled={!newCandidate.full_name || !newCandidate.email}>
              Add Candidate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CandidateCard({
  candidate,
  selected,
  onClick,
  onMove,
  stages,
  scoreColor,
}: {
  candidate: Candidate;
  selected: boolean;
  onClick: () => void;
  onMove: (id: string, stage: CandidateStage) => void;
  stages: CandidateStage[];
  scoreColor: (score?: number) => string;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#0d0d1a] border rounded-[12px] p-3.5 cursor-pointer transition-all hover:border-[rgba(99,102,241,0.3)] group ${
        selected ? "border-[rgba(99,102,241,0.5)] bg-[rgba(99,102,241,0.04)]" : "border-[#1e1e35]"
      }`}
    >
      <div className="flex items-start gap-2.5 mb-2.5">
        <Avatar name={candidate.full_name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#e2e2f0] truncate" style={{ fontFamily: "Syne, sans-serif" }}>
            {candidate.full_name}
          </div>
          <div className="text-[10px] text-[#9494b8] truncate">
            {candidate.current_title} · {candidate.current_company}
          </div>
        </div>
        {candidate.ai_score && (
          <div
            className="text-xs font-bold w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{
              background: `${scoreColor(candidate.ai_score)}18`,
              color: scoreColor(candidate.ai_score),
            }}
          >
            {candidate.ai_score}
          </div>
        )}
      </div>

      {/* AI one-liner */}
      {candidate.ai_one_liner && (
        <div className="flex items-start gap-1.5 mb-2">
          <Sparkles size={9} className="text-[#6366f1] mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-[#9494b8] leading-relaxed line-clamp-2">
            {candidate.ai_one_liner}
          </p>
        </div>
      )}

      {/* Risk flag */}
      {candidate.risk_flag && (
        <div className="flex items-start gap-1.5 mb-2">
          <AlertTriangle size={9} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-[#f59e0b] line-clamp-1">{candidate.risk_flag}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1e1e35]">
        <div className="flex items-center gap-1">
          <Clock size={9} className="text-[#5c5c80]" />
          <span className="text-[10px] text-[#5c5c80]">{formatRelativeTime(candidate.last_activity)}</span>
        </div>
        {candidate.predicted_ramp_weeks && (
          <span className="text-[10px] text-[#5c5c80]">{candidate.predicted_ramp_weeks}w ramp</span>
        )}
      </div>
    </div>
  );
}
