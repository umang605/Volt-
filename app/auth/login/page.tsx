"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-surface-dark p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-on-dark flex items-center justify-center">
            <Zap size={16} className="text-surface-dark" fill="currentColor" />
          </div>
          <span className="text-base font-semibold text-on-dark tracking-tight">VOLT</span>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-on-dark leading-tight mb-4">
            Recruitment intelligence for modern teams.
          </h2>
          <p className="text-sm text-on-dark-soft leading-relaxed">
            Replace your outdated ATS. VOLT gives you AI-powered pipeline management, automated candidate scoring, and smart interview guides — all in one place.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { metric: "3.2×", label: "faster time-to-hire" },
            { metric: "94%", label: "candidate satisfaction" },
            { metric: "60%", label: "less manual work" },
          ].map((s) => (
            <div key={s.metric} className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-on-dark tracking-tight">{s.metric}</span>
              <span className="text-sm text-on-dark-soft">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Zap size={14} className="text-on-primary" fill="currentColor" />
            </div>
            <span className="text-sm font-semibold text-ink">VOLT</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-ink mb-2">Welcome back</h1>
            <p className="text-sm text-muted">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={14} />}
              required
              autoComplete="email"
            />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-ink">Password</label>
                <Link href="#" className="text-xs text-muted hover:text-ink transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={14} />}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-danger/5 border border-danger/20 rounded-lg text-sm text-danger">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign in
              <ArrowRight size={15} />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-hairline text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-ink hover:underline">
              Create one free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
