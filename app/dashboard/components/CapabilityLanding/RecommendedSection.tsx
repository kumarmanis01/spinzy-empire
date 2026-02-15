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

  const toRender = items.length > 0 ? items : fallback;

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Popular For Your Subjects</h2>
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {toRender.map((it) => (
          <RecommendationCard key={it.name} name={it.name} description={it.description} href={it.href} />
        ))}
      </div>
    </section>
  );
}
