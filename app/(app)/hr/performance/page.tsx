"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Star, Target, TrendingUp, Plus, Sparkles } from "lucide-react";

const REVIEWS = [
  {
    id: "1",
    employee: "Arjun Mehta",
    dept: "Engineering",
    period: "Q1 2026",
    goals: ["Ship 3 major features", "Mentor 2 juniors", "Reduce infra costs by 15%"],
    goalCompletion: [100, 100, 80],
    rating: 4.4,
    aiSummary: "Consistent high-performer. Shipped all major deliverables on time. Strong mentor — two reports promoted under his guidance this quarter. Cost reduction target slightly missed but trending correctly.",
    status: "submitted",
  },
  {
    id: "2",
    employee: "Priya Sharma",
    dept: "Product",
    period: "Q1 2026",
    goals: ["Launch 2 new product lines", "Increase NPS by 10 points", "Define Q2 roadmap"],
    goalCompletion: [100, 90, 100],
    rating: 4.7,
    aiSummary: "Exceptional quarter. Both product lines launched ahead of schedule. NPS improved 9 points — close to goal. Road mapping quality praised by leadership. Strong case for promotion consideration.",
    status: "submitted",
  },
  {
    id: "3",
    employee: "Ravi Kumar",
    dept: "Engineering",
    period: "Q1 2026",
    goals: ["Zero downtime quarter", "Implement CI/CD improvements", "Complete security audit"],
    goalCompletion: [70, 60, 100],
    rating: 3.1,
    aiSummary: "Mixed quarter. Security audit completed excellently. CI/CD improvements delayed — need to understand blockers. Two incidents occurred in January. Recommend one-on-one to align on Q2 focus.",
    status: "draft",
  },
];

export default function PerformancePage() {
  const [reviews, setReviews] = useState(REVIEWS);
  const [selected, setSelected] = useState<typeof REVIEWS[0] | null>(null);
  const [addingReview, setAddingReview] = useState(false);

  const ratingColor = (rating: number) => {
    if (rating >= 4.0) return "#22c55e";
    if (rating >= 3.0) return "#f59e0b";
    return "#ef4444";
  };

  const completionColor = (pct: number) => {
    if (pct >= 90) return "#22c55e";
    if (pct >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", background: "linear-gradient(135deg, #14b8a6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Performance Management
          </h1>
          <p className="text-[#9494b8] text-sm">Q1 2026 Review Cycle</p>
        </div>
        <Button variant="primary" onClick={() => setAddingReview(true)}>
          <Plus size={14} />
          New Review
        </Button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Avg Rating", value: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) + "/5", color: "#22c55e" },
          { label: "Reviews Submitted", value: `${reviews.filter((r) => r.status === "submitted").length}/${reviews.length}`, color: "#14b8a6" },
          { label: "Top Performers", value: reviews.filter((r) => r.rating >= 4.5).length, color: "#a855f7" },
          { label: "Needs Attention", value: reviews.filter((r) => r.rating < 3.5).length, color: "#f59e0b" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: "Syne, sans-serif" }}>
              {s.value}
            </div>
            <div className="text-xs text-[#9494b8]">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Review List */}
        <div className="xl:col-span-2 space-y-3">
          {reviews.map((review) => (
            <Card
              key={review.id}
              hover
              className={`p-4 cursor-pointer transition-all ${
                selected?.id === review.id ? "border-[rgba(20,184,166,0.5)]" : ""
              }`}
              onClick={() => setSelected(review)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={review.employee} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#e2e2f0] truncate" >
                      {review.employee}
                    </span>
                    <Badge variant={review.status === "submitted" ? "success" : "default"} size="sm">
                      {review.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-[#9494b8]">{review.dept} · {review.period}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-lg font-bold"
                    style={{ color: ratingColor(review.rating), fontFamily: "Syne, sans-serif" }}
                  >
                    {review.rating}
                  </div>
                  <div className="text-[9px] text-[#5c5c80]">/ 5.0</div>
                </div>
              </div>
              {/* Goal completion bars */}
              <div className="space-y-1.5">
                {review.goals.slice(0, 2).map((goal, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-[#9494b8] truncate">{goal}</span>
                      <span
                        className="text-[10px] font-medium ml-2"
                        style={{ color: completionColor(review.goalCompletion[i]) }}
                      >
                        {review.goalCompletion[i]}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-[#1e1e35] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${review.goalCompletion[i]}%`,
                          background: completionColor(review.goalCompletion[i]),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-3">
          {selected ? (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <Avatar name={selected.employee} size="lg" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-ink" >
                    {selected.employee}
                  </h2>
                  <p className="text-sm text-[#9494b8]">{selected.dept} · {selected.period}</p>
                </div>
                <div className="text-center">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: ratingColor(selected.rating), fontFamily: "Syne, sans-serif" }}
                  >
                    {selected.rating}
                  </div>
                  <div className="flex items-center gap-0.5 justify-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={s <= Math.round(selected.rating) ? "text-[#f59e0b]" : "text-[#252540]"}
                        fill={s <= Math.round(selected.rating) ? "#f59e0b" : "transparent"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="flex items-start gap-2 p-4 bg-[rgba(20,184,166,0.06)] border border-[rgba(20,184,166,0.15)] rounded-[12px] mb-5">
                <Sparkles size={14} className="text-[#14b8a6] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-semibold text-[#14b8a6] uppercase tracking-wider mb-1">
                    AI Performance Summary
                  </div>
                  <p className="text-sm text-[#e2e2f0] leading-relaxed">{selected.aiSummary}</p>
                </div>
              </div>

              {/* Goals */}
              <div>
                <h3 className="text-xs font-semibold text-[#9494b8] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Target size={12} />
                  OKRs / Goals
                </h3>
                <div className="space-y-3">
                  {selected.goals.map((goal, i) => (
                    <div key={i} className="bg-[#12121f] rounded-[10px] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#e2e2f0]">{goal}</span>
                        <span
                          className="text-xs font-bold ml-3"
                          style={{ color: completionColor(selected.goalCompletion[i]) }}
                        >
                          {selected.goalCompletion[i]}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#1e1e35] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${selected.goalCompletion[i]}%`,
                            background: completionColor(selected.goalCompletion[i]),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center text-center h-64">
              <Star size={32} className="text-[#252540] mb-3" />
              <p className="text-[#5c5c80] text-sm">Select a review to see details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
