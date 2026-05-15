"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Lock, User, ArrowRight, Check } from "lucide-react";

const FEATURES = [
  "AI-generated job descriptions in seconds",
  "Automated candidate scoring & ranking",
  "Smart interview guides per candidate",
  "Pipeline velocity analytics",
  "HR module included — payroll, attendance, OKRs",
];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("users").insert({ id: data.user.id, email, full_name: fullName, role: "admin" });
      router.push("/auth/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-surface-dark p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-on-dark flex items-center justify-center">
            <Zap size={16} className="text-surface-dark" fill="currentColor" />
          </div>
          <span className="text-base font-semibold text-on-dark tracking-tight">VOLT</span>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-on-dark leading-tight mb-6">
            Hire faster. Hire smarter.
          </h2>
          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <div className="mt-0.5 w-4 h-4 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-success" />
                </div>
                <span className="text-sm text-on-dark-soft">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-on-dark-soft">
          Free to start. No credit card required.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Zap size={14} className="text-on-primary" fill="currentColor" />
            </div>
            <span className="text-sm font-semibold text-ink">VOLT</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-ink mb-2">Create your account</h1>
            <p className="text-sm text-muted">Free forever. Upgrade when you scale.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User size={14} />}
              required
              autoComplete="name"
            />
            <Input
              label="Work email"
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={14} />}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={14} />}
              minLength={8}
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="p-3.5 bg-danger/5 border border-danger/20 rounded-lg text-sm text-danger">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create account
              <ArrowRight size={15} />
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted text-center">
            By creating an account you agree to our{" "}
            <Link href="#" className="underline hover:text-ink">Terms</Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-ink">Privacy Policy</Link>.
          </p>

          <div className="mt-6 pt-6 border-t border-hairline text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-ink hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
