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
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink mb-5">
            <Zap size={20} className="text-canvas" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-body">
            Sign in to your workspace
          </p>
        </div>

        {/* Form card */}
        <div className="bg-canvas border border-hairline rounded-[16px] p-8">
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
              <div className="bg-danger/8 border border-danger/20 rounded-full px-4 py-2.5 text-sm text-danger">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
              Sign in
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-body">
            No account?{" "}
            <Link href="/auth/signup" className="text-ink font-medium underline hover:no-underline">
              Sign up free
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-mute">
          Replacing every outdated ATS, one hire at a time.
        </p>
      </div>
    </div>
  );
}
