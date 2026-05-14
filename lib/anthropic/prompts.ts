export const SYSTEM_PROMPTS = {
  jdGeneration: `You are VOLT's JD Intelligence engine. Generate precise, compelling job descriptions that attract top talent. Be specific, honest about challenges, and avoid corporate fluff. Format output as JSON.`,

  candidateScoring: `You are VOLT's candidate intelligence engine. Analyze candidate profiles against role requirements. Be honest, direct, and surface non-obvious insights. Score 0-100. Format output as JSON.`,

  interviewGuide: `You are VOLT's interview intelligence engine. Generate targeted interview guides based on role requirements and candidate background. Focus on questions that reveal real capability and culture fit.`,

  morningBrief: `You are VOLT's morning intelligence briefing system. Analyze recruitment pipeline data and surface the most actionable insights. Be direct, urgent where needed, and prioritize ruthlessly. Keep it under 200 words.`,

  debriefAnalysis: `You are VOLT's post-interview decision intelligence engine. Analyze interview debrief notes and surface a decision confidence score with clear reasoning. Be honest about risks.`,

  attritionRisk: `You are VOLT's HR intelligence engine. Analyze employee data patterns and calculate attrition risk scores. Surface early warning signals before they become problems.`,

  payrollAnomaly: `You are VOLT's payroll intelligence engine. Analyze payroll data and flag anomalies, unusual patterns, or discrepancies that require human review.`,
};

export function buildJDPrompt(title: string, department?: string, company?: string) {
  return `Generate a complete job description for: "${title}"
${department ? `Department: ${department}` : ""}
${company ? `Company: ${company}` : ""}

Return JSON with:
{
  "description": "Full JD (2-3 paragraphs, energetic but honest)",
  "requirements": ["requirement 1", "requirement 2", ...],
  "urgency_score": 0-100,
  "difficulty_score": 0-100,
  "avg_days_to_fill": number,
  "salary_min": number,
  "salary_max": number,
  "interview_questions": ["question 1", "question 2", "question 3"],
  "ideal_candidate_profile": "2-3 sentence personality/trait profile",
  "top_risks": ["risk 1", "risk 2", "risk 3"],
  "ai_summary": "One punchy sentence about this role"
}`;
}

export function buildCandidateScoringPrompt(
  candidateName: string,
  candidateBackground: string,
  roleTitle: string,
  roleDescription: string
) {
  return `Score this candidate for this role:

CANDIDATE: ${candidateName}
BACKGROUND: ${candidateBackground}

ROLE: ${roleTitle}
DESCRIPTION: ${roleDescription}

Return JSON with:
{
  "ai_score": 0-100,
  "ai_one_liner": "One sharp sentence about this candidate",
  "predicted_ramp_weeks": number,
  "risk_flag": "One honest risk or null",
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1", "gap 2"]
}`;
}

export function buildMorningBriefPrompt(data: {
  userName: string;
  urgentRoles: number;
  inactiveCount: number;
  expiringOffers: number;
  totalCandidates: number;
  hiredThisMonth: number;
  pipelineHealth: number;
}) {
  return `Generate a morning recruitment brief for ${data.userName}.

Data:
- Urgent open roles: ${data.urgentRoles}
- Candidates inactive 5+ days: ${data.inactiveCount}
- Offers expiring this week: ${data.expiringOffers}
- Total active candidates: ${data.totalCandidates}
- Hired this month: ${data.hiredThisMonth}
- Pipeline health score: ${data.pipelineHealth}/100

Write a sharp, actionable morning brief (under 150 words). Be direct. No fluff. Prioritize what needs attention TODAY.`;
}

export function buildInterviewGuidePrompt(
  candidateName: string,
  roleTitle: string,
  candidateBackground: string,
  roleRequirements: string[]
) {
  return `Generate an interview guide for:
CANDIDATE: ${candidateName}
ROLE: ${roleTitle}
BACKGROUND: ${candidateBackground}
REQUIREMENTS: ${roleRequirements.join(", ")}

Return a targeted interview guide with:
1. Opening (2 min)
2. Experience deep-dive (3 questions with follow-ups)
3. Role-specific scenarios (2 situations)
4. Culture/motivation probe (2 questions)
5. Red flags to watch for
6. Closing questions to ask candidate

Keep it practical and conversion-focused.`;
}
