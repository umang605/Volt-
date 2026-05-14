import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/anthropic/client";
import { SYSTEM_PROMPTS, buildJDPrompt } from "@/lib/anthropic/prompts";

export async function POST(req: NextRequest) {
  try {
    const { title, department, company } = await req.json();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const prompt = buildJDPrompt(title, department, company);
    const raw = await generateText(prompt, SYSTEM_PROMPTS.jdGeneration);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("JD generation error:", error);
    return NextResponse.json({ error: "Failed to generate JD" }, { status: 500 });
  }
}
