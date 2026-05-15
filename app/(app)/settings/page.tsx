"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Bell,
  Link2,
  CreditCard,
  CheckCircle2,
  Zap,
} from "lucide-react";

const TABS = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink mb-1" >
          Settings
        </h1>
        <p className="text-body text-sm">Configure your VOLT workspace</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm text-left transition-all ${
                activeTab === id
                  ? "bg-[rgba(99,102,241,0.12)] text-[#818cf8]"
                  : "text-body hover:text-ink hover:bg-surface-soft"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "company" && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-ink mb-5" >
                Company Profile
              </h2>
              <div className="space-y-4">
                <Input label="Company Name" defaultValue="Acme Corp" />
                <Select
                  label="Company Size"
                  options={[
                    { value: "1-10", label: "1–10 employees" },
                    { value: "11-50", label: "11–50 employees" },
                    { value: "51-200", label: "51–200 employees" },
                    { value: "201-1000", label: "201–1,000 employees" },
                  ]}
                  defaultValue="51-200"
                />
                <Select
                  label="Industry"
                  options={[
                    { value: "Technology", label: "Technology" },
                    { value: "Finance", label: "Finance" },
                    { value: "Healthcare", label: "Healthcare" },
                  ]}
                  defaultValue="Technology"
                />
                <Input label="Company Website" defaultValue="https://acme.com" />
                <Button onClick={save} className="mt-2">
                  {saved ? <><CheckCircle2 size={14} /> Saved</> : "Save Changes"}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-ink mb-5" >
                Notification Preferences
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Candidate stage changes", on: true },
                  { label: "New application received", on: true },
                  { label: "Offer expiring soon", on: true },
                  { label: "Interview reminder (24h before)", on: true },
                  { label: "Pipeline health drops below 50%", on: false },
                  { label: "AI morning brief", on: true },
                  { label: "Team activity digest (weekly)", on: false },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between p-3 bg-surface-soft rounded-[10px]">
                    <span className="text-sm text-ink">{pref.label}</span>
                    <div
                      className={`w-10 h-5 rounded-full flex items-center transition-all cursor-pointer ${
                        pref.on ? "bg-[#6366f1]" : "bg-[#252540]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow mx-0.5 transition-all ${
                          pref.on ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "integrations" && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-ink mb-5" >
                Integrations
              </h2>
              <div className="space-y-3">
                {[
                  { name: "LinkedIn Jobs", desc: "Auto-post roles to LinkedIn", status: "available" },
                  { name: "Indeed", desc: "Sync job postings with Indeed", status: "available" },
                  { name: "Google Calendar", desc: "Sync interview schedules", status: "connected" },
                  { name: "Slack", desc: "Get notifications in Slack", status: "available" },
                  { name: "Greenhouse", desc: "Import from Greenhouse ATS", status: "coming_soon" },
                  { name: "Workday", desc: "Sync with Workday HRIS", status: "coming_soon" },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between p-4 bg-surface-soft rounded-[12px] border border-hairline"
                  >
                    <div>
                      <div className="text-sm font-medium text-ink">{integration.name}</div>
                      <div className="text-xs text-body">{integration.desc}</div>
                    </div>
                    {integration.status === "connected" ? (
                      <Badge variant="success">Connected</Badge>
                    ) : integration.status === "coming_soon" ? (
                      <Badge variant="default">Coming Soon</Badge>
                    ) : (
                      <Button size="sm" variant="secondary">Connect</Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-ink mb-5" >
                Billing
              </h2>
              <div className="p-6 bg-surface-dark rounded-[12px] mb-5 text-center">
                <div className="w-12 h-12 bg-on-dark rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap size={22} className="text-ink" fill="white" />
                </div>
                <div className="text-2xl font-bold text-ink mb-1" >
                  VOLT Pro
                </div>
                <div className="text-sm text-body mb-3">Unlimited roles · Unlimited candidates · AI-powered</div>
                <Badge variant="volt">Active Subscription</Badge>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Plan", value: "VOLT Pro" },
                  { label: "Billing cycle", value: "Monthly" },
                  { label: "Next billing date", value: "June 1, 2026" },
                  { label: "Amount", value: "$299/month" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-hairline">
                    <span className="text-body">{item.label}</span>
                    <span className="text-ink font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="w-full mt-5">Manage Billing</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
