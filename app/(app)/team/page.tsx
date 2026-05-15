"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import {
  Plus,
  Mail,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  Activity,
  Users,
} from "lucide-react";

const MOCK_TEAM = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@company.com",
    role: "recruiter" as const,
    timeToHire: 28,
    offerRate: 84,
    activeRoles: 3,
    pipeline: 18,
    lastActive: "2 hours ago",
    activity: [
      "Moved Marcus Webb to Offer",
      "Scheduled 2 interviews for Data Science",
      "Posted new Backend Engineer role",
    ],
  },
  {
    id: "2",
    name: "James Okoro",
    email: "james@company.com",
    role: "hiring_manager" as const,
    timeToHire: 35,
    offerRate: 71,
    activeRoles: 2,
    pipeline: 12,
    lastActive: "1 hour ago",
    activity: ["Completed debrief for Frontend Lead", "Reviewed 3 candidate profiles"],
  },
  {
    id: "3",
    name: "Priya Nair",
    email: "priya@company.com",
    role: "recruiter" as const,
    timeToHire: 31,
    offerRate: 79,
    activeRoles: 4,
    pipeline: 22,
    lastActive: "3 hours ago",
    activity: ["Scheduled 3 interviews", "Sent rejection feedback to 4 candidates"],
  },
];

const ROLE_LABELS = {
  admin: "Admin",
  recruiter: "Recruiter",
  hiring_manager: "Hiring Manager",
};

const ROLE_COLORS: Record<string, "volt" | "hr" | "default"> = {
  admin: "volt",
  recruiter: "hr",
  hiring_manager: "default",
};

export default function TeamPage() {
  const [team, setTeam] = useState(MOCK_TEAM);
  const [search, setSearch] = useState("");
  const [inviting, setInviting] = useState(false);
  const [selected, setSelected] = useState<typeof MOCK_TEAM[0] | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("recruiter");

  const filtered = team.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1" >
            Team
          </h1>
          <p className="text-body text-sm">{team.length} members</p>
        </div>
        <Button onClick={() => setInviting(true)}>
          <Plus size={14} />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Avg Time to Hire", value: "31 days", icon: Clock, color: "#818cf8" },
          { label: "Offer Acceptance", value: "78%", icon: CheckCircle2, color: "#22c55e" },
          { label: "Active Pipeline", value: "52 candidates", icon: Users, color: "#a855f7" },
          { label: "Roles Covered", value: "9 roles", icon: Activity, color: "#f59e0b" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                style={{ background: `${s.color}18` }}
              >
                <s.icon size={14} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-xl font-bold text-ink" >
              {s.value}
            </div>
            <div className="text-xs text-body">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <Card
            key={member.id}
            hover
            className="p-5 cursor-pointer"
            onClick={() => setSelected(member)}
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={member.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink truncate" >
                    {member.name}
                  </span>
                  <Badge variant={ROLE_COLORS[member.role]} size="sm">
                    {ROLE_LABELS[member.role]}
                  </Badge>
                </div>
                <div className="text-xs text-mute truncate">{member.email}</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Time to Hire", value: `${member.timeToHire}d`, color: "#818cf8" },
                { label: "Offer Rate", value: `${member.offerRate}%`, color: "#22c55e" },
                { label: "Pipeline", value: member.pipeline, color: "#a855f7" },
              ].map((m) => (
                <div key={m.label} className="bg-surface-soft rounded-[8px] p-2 text-center">
                  <div className="text-sm font-bold" style={{ color: m.color, fontFamily: "Syne, sans-serif" }}>
                    {m.value}
                  </div>
                  <div className="text-[9px] text-mute">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="space-y-1.5">
              {member.activity.slice(0, 2).map((a, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-[#252540] mt-1.5 flex-shrink-0" />
                  <span className="text-[10px] text-body leading-relaxed">{a}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between">
              <span className="text-[10px] text-mute">Active {member.lastActive}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            </div>
          </Card>
        ))}
      </div>

      {/* Invite Modal */}
      <Modal open={inviting} onClose={() => setInviting(false)} title="Invite Team Member">
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            icon={<Mail size={14} />}
          />
          <Select
            label="Role"
            options={[
              { value: "recruiter", label: "Recruiter" },
              { value: "hiring_manager", label: "Hiring Manager" },
              { value: "admin", label: "Admin" },
            ]}
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          />
          <div className="p-3 bg-[rgba(99,102,241,0.06)] border border-[rgba(99,102,241,0.15)] rounded-[10px]">
            <p className="text-xs text-[#818cf8]">
              An invite link will be sent to their email. They'll set up their account and be added to your VOLT workspace.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setInviting(false)}>
              Cancel
            </Button>
            <Button className="flex-1" disabled={!inviteEmail} onClick={() => setInviting(false)}>
              <Mail size={14} />
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
