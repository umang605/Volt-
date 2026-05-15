"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Pin,
  Plus,
  Star,
  Gift,
  Trophy,
  Heart,
  Megaphone,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  type: "company" | "birthday" | "shoutout" | "policy";
  pinned: boolean;
  created_at: string;
  reactions: Record<string, number>;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Q1 Wins — We crushed it 🏆",
    content: "Team, what a quarter. We shipped 12 features, hired 8 incredible people, and hit 104% of our revenue target. None of this happens without each of you. Especially proud of how the Engineering team handled the March incident — owned it, fixed it, built a better system. That's who we are.",
    author: "CEO",
    type: "company" as const,
    pinned: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: { "🔥": 14, "💪": 9, "❤️": 7 },
  },
  {
    id: "2",
    title: "Happy Birthday, Priya! 🎂",
    content: "Wishing a very happy birthday to Priya Sharma, our brilliant Product Manager. 3 years of incredible work, 2 product launches, and countless product debates that made everything better. Celebrate today! 🎉",
    author: "HR Team",
    type: "birthday" as const,
    pinned: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reactions: { "🎂": 11, "🎉": 8, "❤️": 6 },
  },
  {
    id: "3",
    title: "Shoutout — Arjun saved the day ⚡",
    content: "Big shoutout to Arjun Mehta for staying up until 2am to resolve the payment processing issue last Thursday. Customers didn't even know it happened. That's the standard we set for ourselves. Thank you, Arjun.",
    author: "Priya Sharma",
    type: "shoutout" as const,
    pinned: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: { "⚡": 18, "🙌": 12, "💙": 9 },
  },
  {
    id: "4",
    title: "New Office Policy — Flex Fridays",
    content: "Starting June 1, every Friday is a flex day. Work from wherever you do your best work — home, office, coffee shop. No core hours on Fridays. Just deliver what you committed to. Trust is the foundation.",
    author: "Operations",
    type: "policy" as const,
    pinned: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: { "🙌": 22, "🎉": 15 },
  },
];

const TYPE_CONFIG = {
  company: { icon: Megaphone, color: "#6366f1", label: "Company" },
  birthday: { icon: Gift, color: "#ec4899", label: "Birthday" },
  shoutout: { icon: Star, color: "#f59e0b", label: "Shoutout" },
  policy: { icon: Trophy, color: "#14b8a6", label: "Policy" },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const addReaction = (id: string, emoji: string) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, reactions: { ...a.reactions, [emoji]: (a.reactions[emoji] || 0) + 1 } }
          : a
      )
    );
  };

  const createAnnouncement = () => {
    const newAnn = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      author: "You",
      type: "company" as const,
      pinned: false,
      created_at: new Date().toISOString(),
      reactions: {},
    };
    setAnnouncements([newAnn, ...announcements]);
    setCreating(false);
    setNewTitle("");
    setNewContent("");
  };

  const pinned = announcements.filter((a) => a.pinned);
  const rest = announcements.filter((a) => !a.pinned);

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", background: "linear-gradient(135deg, #14b8a6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Culture Board
          </h1>
          <p className="text-[#9494b8] text-sm">Announcements, wins, shoutouts</p>
        </div>
        <Button variant="primary" onClick={() => setCreating(true)}>
          <Plus size={14} />
          Post Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {/* Pinned */}
        {pinned.map((ann) => (
          <AnnouncementCard key={ann.id} ann={ann} onReact={addReaction} />
        ))}

        {/* Regular */}
        {rest.map((ann) => (
          <AnnouncementCard key={ann.id} ann={ann} onReact={addReaction} />
        ))}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="Post Announcement">
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Q2 Kickoff — What we're building"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Textarea
            label="Content"
            placeholder="Share a company update, celebrate a win, or give a shoutout..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={5}
          />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setCreating(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={createAnnouncement} disabled={!newTitle || !newContent}>
              Post Announcement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AnnouncementCard({
  ann,
  onReact,
}: {
  ann: typeof MOCK_ANNOUNCEMENTS[0];
  onReact: (id: string, emoji: string) => void;
}) {
  const typeConfig = TYPE_CONFIG[ann.type];
  const TypeIcon = typeConfig.icon;

  return (
    <Card className="p-5 hover:border-[rgba(20,184,166,0.2)] transition-all">
      {ann.pinned && (
        <div className="flex items-center gap-1 mb-3">
          <Pin size={11} className="text-[#14b8a6]" />
          <span className="text-[10px] text-[#14b8a6] uppercase tracking-wider">Pinned</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${typeConfig.color}18` }}
        >
          <TypeIcon size={15} style={{ color: typeConfig.color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-[#e2e2f0]" >
              {ann.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-[#5c5c80]">{ann.author}</span>
            <span className="text-[#252540]">·</span>
            <span className="text-xs text-[#5c5c80]">{formatRelativeTime(ann.created_at)}</span>
            <span
              className="inline-flex items-center rounded-[6px] font-medium text-[10px] px-2 py-0.5"
              style={{
                background: `${typeConfig.color}15`,
                color: typeConfig.color,
                border: `1px solid ${typeConfig.color}30`,
              }}
            >
              {typeConfig.label}
            </span>
          </div>
          <p className="text-sm text-[#9494b8] leading-relaxed mb-4">{ann.content}</p>
          {/* Reactions */}
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(ann.reactions).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReact(ann.id, emoji)}
                className="flex items-center gap-1 px-2 py-1 rounded-[8px] bg-[#12121f] border border-[#1e1e35] hover:border-[rgba(20,184,166,0.3)] transition-all"
              >
                <span className="text-sm">{emoji}</span>
                <span className="text-xs text-[#9494b8]">{count}</span>
              </button>
            ))}
            {["❤️", "👏", "🚀"].map((emoji) => !ann.reactions[emoji] && (
              <button
                key={emoji}
                onClick={() => onReact(ann.id, emoji)}
                className="text-sm px-2 py-1 rounded-[8px] bg-[#12121f] border border-[#1e1e35] hover:border-[rgba(20,184,166,0.3)] transition-all text-[#5c5c80] hover:text-[#e2e2f0]"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
