'use client';

import React from 'react';

interface RecommendationCardProps {
  name: string;
  description: string;
  href: string;
}

export function RecommendationCard({ name, description, href }: RecommendationCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col justify-between shadow-sm bg-white">
      <div>
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="mt-4 text-right">
        <a
          href={href}
          onClick={() => {
            try {
              const slug = href.replace(/^\/apps\/?/, '').replace(/(^\/|\/$)/g, '');
              if (slug) window.localStorage.setItem('lastAppVisited', slug);
            } catch (_err) {}
          }}
          className="inline-flex items-center px-3 py-1.5 bg-primary text-white rounded-md text-sm"
        >
          Open
        </a>
      </div>
    </div>
  );
}

export default RecommendationCard;
