import { NextResponse } from "next/server";
import { buildDailySummary } from "@/data-intelligence/reports/daily_summary";
import { rankAppIdeas } from "@/data-intelligence/app-suggester/priority_ranker";
import { detectTrends } from "@/data-intelligence/app-suggester/trend_detector";

export async function GET() {
  try {
    const summary = await buildDailySummary();
    const trends = detectTrends(summary);
    const ranked = rankAppIdeas(trends);

    return NextResponse.json({
      success: true,
      ideas: ranked.slice(0, 5),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message ?? String(err),
    });
  }
}
