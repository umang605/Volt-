import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateText(prompt: string, systemPrompt?: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt || "You are VOLT, an AI recruitment intelligence assistant. Be concise, sharp, and insightful.",
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type === "text") return content.text;
  return "";
}
