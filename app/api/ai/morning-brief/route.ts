import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/anthropic/client";
import { SYSTEM_PROMPTS, buildMorningBriefPrompt } from "@/lib/anthropic/prompts";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const prompt = buildMorningBriefPrompt(data);
    const brief = await generateText(prompt, SYSTEM_PROMPTS.morningBrief);
    return NextResponse.json({ brief });
  } catch (error) {
    console.error("Morning brief error:", error);
    return NextResponse.json({ error: "Failed to generate brief" }, { status: 500 });
  }
}
