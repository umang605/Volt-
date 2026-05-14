"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Lock, User } from "lucide-react";

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
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create user record
      await supabase.from("users").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "admin",
      });
      router.push("/auth/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-[#a855f7]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center shadow-lg shadow-[rgba(99,102,241,0.4)]">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              VOLT
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Start hiring smarter
          </h1>
          <p className="text-[#9494b8] text-sm">
            Join the next generation of recruitment intelligence
          </p>
        </div>

        <div className="bg-[#0d0d1a] border border-[#1e1e35] rounded-[20px] p-8">
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User size={14} />}
              required
            />
            <Input
              label="Work Email"
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={14} />}
              required
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
            />

            {error && (
              <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-[10px] p-3 text-sm text-[#ef4444]">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#9494b8]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#818cf8] hover:text-white transition-colors">
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#5c5c80]">
          No credit card required. Free to start.
        </p>
      </div>
    </div>
  );
}
