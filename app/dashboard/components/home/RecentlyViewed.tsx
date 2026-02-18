"use client";
import React, { useEffect, useState } from 'react';
import { getRecentlyViewedSorted } from '@/app/utils/recordAppUsage';
import { GeneratedApps } from '@/app-factory/generated-apps/registry';
import { useRouter } from 'next/navigation';

export function RecentlyViewed() {
  const [items, setItems] = useState<Array<{ slug: string; lastViewed: number; count: number }>>([])
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = getRecentlyViewedSorted()
      const filtered = raw
        .filter((r) => !!GeneratedApps[r.slug])
        .map((r) => ({ slug: r.slug, lastViewed: r.entry.lastViewed, count: r.entry.count }))
      setItems(filtered)
    } catch (e) {
      setItems([])
    }
  }, [])

  if (!items.length) return null

  return (
    <section aria-labelledby="recently-viewed-heading">
      <div className="flex items-center justify-between">
        <h2 id="recently-viewed-heading" className="text-lg font-semibold">Recently Viewed</h2>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {items.map((it) => (
          <button
            key={it.slug}
            onClick={() => router.push(`/apps/${it.slug}`)}
            className="bg-card rounded-lg p-3 text-left"
          >
            <div className="text-sm font-medium truncate">{it.slug.replace(/-/g, ' ')}</div>
            <div className="text-xs text-muted-foreground">Viewed {new Date(it.lastViewed).toLocaleString()}</div>
          </button>
        ))}
      </div>
    </section>
  )
}

export default RecentlyViewed
