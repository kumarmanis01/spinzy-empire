"use client";
/**
 * Utility to record and read micro-app usage in localStorage.
 * Stored shape:
 * {
 *   "algebra-explainer": { count: number, lastViewed: number }
 * }
 */
export type AppUsageEntry = { count: number; lastViewed: number }

const STORAGE_KEY = 'appUsage'

export function readAppUsage(): Record<string, AppUsageEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch (e) {
    return {}
  }
}

export function writeAppUsage(data: Record<string, AppUsageEntry>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    // ignore quota errors
  }
}

export function recordAppUsage(slug: string) {
  if (!slug) return
  try {
    const data = readAppUsage()
    const now = Date.now()
    const prev = data[slug]
    data[slug] = prev ? { count: prev.count + 1, lastViewed: now } : { count: 1, lastViewed: now }
    writeAppUsage(data)
  } catch (e) {
    // swallow
  }
}

export function getRecentlyViewedSorted(): Array<{ slug: string; entry: AppUsageEntry }> {
  const data = readAppUsage()
  return Object.keys(data)
    .map((s) => ({ slug: s, entry: data[s] }))
    .sort((a, b) => b.entry.lastViewed - a.entry.lastViewed)
}

export default recordAppUsage
