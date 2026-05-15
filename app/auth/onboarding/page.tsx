"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Zap, Building2, Users, Briefcase } from "lucide-react";

const SIZE_OPTIONS = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-1000", label: "201–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

const INDUSTRY_OPTIONS = [
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance & Banking" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Retail", label: "Retail & E-commerce" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Consulting", label: "Consulting" },
  { value: "Education", label: "Education" },
  { value: "Media", label: "Media & Entertainment" },
  { value: "Other", label: "Other" },
];

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin (full access)" },
  { value: "recruiter", label: "Recruiter" },
  { value: "hiring_manager", label: "Hiring Manager" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [companyName, setCompanyName] = useState("");
  const [size, setSize] = useState("11-50");
  const [industry, setIndustry] = useState("Technology");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleComplete = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    // Create company
    const { data: company } = await supabase
      .from("companies")
      .insert({ name: companyName, size, industry })
      .select()
      .single();

    if (company) {
      await supabase
        .from("users")
        .update({ company_id: company.id, role })
        .eq("id", user.id);
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#6366f1]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-[rgba(99,102,241,0.4)]">
              <Zap size={20} className="text-ink" fill="white" />
            </div>
            <span className="text-2xl font-bold text-ink" >
              VOLT
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s <= step
                      ? "bg-gradient-to-br from-[#6366f1] to-[#a855f7] text-white"
                      : "bg-surface-soft text-mute border border-hairline-strong"
                  }`}
                >
                  {s}
                </div>
                {s < 2 && <div className="w-12 h-px bg-[#252540]" />}
              </div>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-ink mb-2" >
            {step === 1 ? "Tell us about your company" : "Your role"}
          </h1>
          <p className="text-body text-sm">
            {step === 1
              ? "We'll tailor VOLT to your hiring needs"
              : "How will you be using VOLT?"}
          </p>
        </div>

        <div className="bg-surface-soft border border-hairline rounded-[20px] p-8">
          {step === 1 ? (
            <div className="flex flex-col gap-5">
              <Input
                label="Company Name"
                placeholder="Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                icon={<Building2 size={14} />}
                required
              />
              <Select
                label="Company Size"
                options={SIZE_OPTIONS}
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
              <Select
                label="Industry"
                options={INDUSTRY_OPTIONS}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <Button
                className="w-full mt-2"
                size="lg"
                onClick={() => setStep(2)}
                disabled={!companyName.trim()}
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: "admin", icon: Zap, label: "Admin", desc: "Full platform access, manage team" },
                  { value: "recruiter", icon: Briefcase, label: "Recruiter", desc: "Manage roles and candidates" },
                  { value: "hiring_manager", icon: Users, label: "Hiring Manager", desc: "Review candidates, give feedback" },
                ].map(({ value, icon: Icon, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setRole(value)}
                    className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${
                      role === value
                        ? "border-[#6366f1] bg-[rgba(99,102,241,0.1)]"
                        : "border-hairline bg-surface-soft hover:border-hairline-strong"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                        role === value
                          ? "bg-gradient-to-br from-[#6366f1] to-[#a855f7]"
                          : "bg-surface-soft"
                      }`}
                    >
                      <Icon size={16} className={role === value ? "text-white" : "text-mute"} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-ink" >
                        {label}
                      </div>
                      <div className="text-xs text-body mt-0.5">{desc}</div>
                    </div>
                    {role === value && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-[#6366f1] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-2">
                <Button variant="secondary" className="flex-1" size="lg" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" size="lg" loading={loading} onClick={handleComplete}>
                  Launch VOLT ⚡
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
