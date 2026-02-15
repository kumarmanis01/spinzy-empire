'use client';

import React from 'react';
import RecommendationCard from './RecommendationCard';

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

  const fallback = [
    { name: 'Algebra Explainer', description: 'Step-by-step algebra concepts and worked examples.', href: '/apps/algebra-explainer' },
    { name: 'Photosynthesis Explainer', description: 'Clear explanation of how plants make food.', href: '/apps/photosynthesis-explainer' },
  ];
  const [lastTopic, setLastTopic] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const v = localStorage.getItem('lastTopic');
      setLastTopic(v);
    } catch (_) {
      setLastTopic(null);
    }
  }, []);

  let toRender = items.length > 0 ? items : fallback;
  let header = 'Popular For Your Subjects';

  const [resolvedRecommendation, setResolvedRecommendation] = React.useState<{ name: string; description: string; href: string } | null>(null);

  React.useEffect(() => {
    if (!lastTopic) return;

    header = 'Recommended For You';

    // deterministic slug mapping
    const raw = lastTopic.toLowerCase().trim();
    const slugBase = raw.replace(/\s+/g, '-');
    const candidateSlug = `${slugBase}-explainer`;

    // check if route exists by attempting a HEAD request
    (async () => {
      try {
        const resp = await fetch(`/apps/${candidateSlug}`, { method: 'HEAD' });
        if (resp.ok) {
          setResolvedRecommendation({
            name: `${lastTopic} Explainer`,
            description: `Learn about ${lastTopic}.`,
            href: `/apps/${candidateSlug}`,
          });
        } else {
          setResolvedRecommendation(null);
        }
      } catch (e) {
        setResolvedRecommendation(null);
      }
    })();
  }, [lastTopic]);

  if (resolvedRecommendation) {
    toRender = [resolvedRecommendation];
    header = 'Recommended For You';
  }

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
<<<<<<< HEAD
        <h2 className="text-lg font-semibold">{header}</h2>
=======
        <h2 className="text-lg font-semibold">Popular For Your Subjects</h2>
>>>>>>> origin/main
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {toRender.map((it) => (
          <RecommendationCard key={it.name} name={it.name} description={it.description} href={it.href} />
        ))}
      </div>
    </section>
  );
}
