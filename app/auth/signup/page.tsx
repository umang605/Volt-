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
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
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
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink mb-5">
            <Zap size={20} className="text-canvas" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Start hiring smarter
          </h1>
          <p className="text-sm text-body">
            Join the next generation of recruitment intelligence
          </p>
        </div>

        {/* Form card */}
        <div className="bg-canvas border border-hairline rounded-[16px] p-8">
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User size={14} />}
              required
            />
            <Input
              label="Work email"
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
              <div className="bg-danger/8 border border-danger/20 rounded-full px-4 py-2.5 text-sm text-danger">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
              Create account
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-body">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-ink font-medium underline hover:no-underline">
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-mute">
          No credit card required. Free to start.
        </p>
      </div>
    </div>
  );
}
