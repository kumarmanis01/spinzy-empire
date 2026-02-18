import { NextResponse } from "next/server";
import { generateDailySummary } from "@/data-intelligence/reports/daily_summary";
import { generateCandidatesFromSummary } from "@/data-intelligence/app-suggester/app_idea_generator";

export async function GET() {
  try {
    const summary = await generateDailySummary();
    const ideas = generateCandidatesFromSummary(summary);

    return NextResponse.json({
      success: true,
      ideas: ideas.slice(0, 5),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message ?? String(err),
    });
  }
}
