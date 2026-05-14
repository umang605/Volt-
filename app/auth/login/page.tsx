"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Lock } from "lucide-react";

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
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#a855f7]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-[rgba(99,102,241,0.4)]">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              VOLT
            </span>
          </div>
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Welcome back
          </h1>
          <p className="text-[#9494b8] text-sm">
            Sign in to your recruitment intelligence platform
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#0d0d1a] border border-[#1e1e35] rounded-[20px] p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={14} />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={14} />}
              required
            />

            {error && (
              <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-[10px] p-3 text-sm text-[#ef4444]">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#9494b8]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-[#818cf8] hover:text-white transition-colors">
              Sign up free
            </Link>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#5c5c80]">
            Replacing every outdated ATS, one hire at a time.
          </p>
        </div>
      </div>
    </div>
  );
}
