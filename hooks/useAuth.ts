"use client";

import { useEffect, useRef, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let mounted = true;

    import("@/lib/supabase/client").then(({ createClient }) => {
      if (!mounted) return;
      const supabase = createClient();

      supabase.auth.getSession().then(({ data: { session } }: { data: { session: { user: SupabaseUser } | null } }) => {
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_: string, session: { user: SupabaseUser } | null) => {
          if (mounted) setUser(session?.user ?? null);
        }
      );

      unsubRef.current = () => subscription.unsubscribe();
    });

    return () => {
      mounted = false;
      unsubRef.current?.();
    };
  }, []);

  const signOut = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    await createClient().auth.signOut();
  };

  return { user, loading, signOut };
}
