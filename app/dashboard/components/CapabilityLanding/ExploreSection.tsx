'use client';

import React from 'react';

const GROUPS = [
  { title: 'Math Explainers', items: ['Algebra', 'Geometry', 'Trigonometry'] },
  { title: 'Science Explainers', items: ['Photosynthesis', 'Cell Structure', 'Human Body'] },
  { title: 'Coding Explainers', items: ['Loops', 'Variables', 'Functions'] },
];

export default function ExploreSection() {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">Explore Concepts</h2>
      <div className="mt-3 space-y-4">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-medium">{g.title}</h3>
            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
