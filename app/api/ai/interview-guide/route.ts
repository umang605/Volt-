import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/anthropic/client";
import { SYSTEM_PROMPTS, buildInterviewGuidePrompt } from "@/lib/anthropic/prompts";

export async function POST(req: NextRequest) {
  try {
    const { candidateName, roleTitle, candidateBackground, roleRequirements } =
      await req.json();

    const prompt = buildInterviewGuidePrompt(
      candidateName,
      roleTitle,
      candidateBackground,
      roleRequirements || []
    );
    const guide = await generateText(prompt, SYSTEM_PROMPTS.interviewGuide);
    return NextResponse.json({ guide });
  } catch (error) {
    console.error("Interview guide error:", error);
    return NextResponse.json({ error: "Failed to generate guide" }, { status: 500 });
  }
}
