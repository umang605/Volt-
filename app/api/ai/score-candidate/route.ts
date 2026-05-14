import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/anthropic/client";
import { SYSTEM_PROMPTS, buildCandidateScoringPrompt } from "@/lib/anthropic/prompts";

export async function POST(req: NextRequest) {
  try {
    const { candidateName, candidateBackground, roleTitle, roleDescription } =
      await req.json();

    const prompt = buildCandidateScoringPrompt(
      candidateName,
      candidateBackground,
      roleTitle,
      roleDescription
    );
    const raw = await generateText(prompt, SYSTEM_PROMPTS.candidateScoring);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Candidate scoring error:", error);
    return NextResponse.json({ error: "Failed to score candidate" }, { status: 500 });
  }
}
