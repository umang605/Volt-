import { TopNav } from "@/components/volt/TopNav";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <TopNav />
      <main className="pt-14 min-h-screen">
        {children}
      </main>
    </div>
  );
}
