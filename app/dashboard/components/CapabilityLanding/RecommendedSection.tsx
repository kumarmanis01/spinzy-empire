'use client';

import React from 'react';
import RecommendationCard from './RecommendationCard';
import { GeneratedApps } from '@/app-factory/generated-apps/registry';

function getColdStartApps(user: any) {
  if (!user) return [];

  const apps: { name: string; description: string; href: string }[] = [];

  if (user.subjects?.includes('Math')) {
    apps.push({
      name: 'Algebra Explainer',
      description: 'Step-by-step algebra concepts and worked examples.',
      href: '/apps/algebra-explainer',
    });
  }

  if (user.subjects?.includes('Science')) {
    apps.push({
      name: 'Photosynthesis Explainer',
      description: 'Clear explanation of how plants make food.',
      href: '/apps/photosynthesis-explainer',
    });
  }

  if (user.subjects?.includes('Coding')) {
    apps.push({
      name: 'Intro to Loops',
      description: 'Programming loops explained with examples.',
      href: '/apps/loops-explainer',
    });
  }

  return apps.slice(0, 3);
}

export default function RecommendedSection({ user }: { user?: any }) {
  const items = getColdStartApps(user);

  const [topicInterest, setTopicInterest] = React.useState<Record<string, { count: number; lastViewed: number }>>({});

  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('topicInterest') || '{}');
      setTopicInterest(stored);
    } catch (_) {
      setTopicInterest({});
    }
  }, []);

  let toRender = items;
  let header = 'Popular For Your Subjects';

  const entries = Object.keys(topicInterest).map((t) => ({
    topic: t,
    count: topicInterest[t].count || 0,
    lastViewed: topicInterest[t].lastViewed || 0,
  }));

  if (entries.length > 0) {
    // sort by count desc, then lastViewed desc
    entries.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.lastViewed - a.lastViewed;
    });

    header = 'Recommended For You';
    toRender = entries.map((e) => {
      const raw = e.topic.toLowerCase().trim();
      const slugBase = raw.replace(/\s+/g, '-');
      const candidateSlug = `${slugBase}-explainer`;
      return {
        name: `${e.topic} Explainer`,
        description: `Learn about ${e.topic}.`,
        href: `/apps/${candidateSlug}`,
        __slug: candidateSlug,
      };
    });
  }

  const hrefToSlug = (href: string) => {
    if (!href) return '';
    const parts = href.replace(/\/+$/, '').split('/');
    return parts[parts.length - 1] || '';
  };

  const filtered = toRender.filter((it) => {
    const slug = (it as any).__slug || hrefToSlug(it.href);
    return !!GeneratedApps[slug];
  });

  if (filtered.length === 0) {
    return (
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Explore Topics</h2>
        <p className="text-sm text-muted-foreground">Search to start learning.</p>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{header}</h2>
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {filtered.map((it) => (
          <RecommendationCard key={it.name} name={it.name} description={it.description} href={it.href} />
        ))}
      </div>
    </section>
  );
}
