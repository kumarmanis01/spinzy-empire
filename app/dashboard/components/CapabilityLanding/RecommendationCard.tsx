'use client';

import React from 'react';

interface RecommendationCardProps {
  name: string;
  description: string;
  href: string;
}

export function RecommendationCard({ name, description, href }: RecommendationCardProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      // derive app slug like 'photosynthesis-explainer' from '/apps/photosynthesis-explainer'
      const slug = href.replace(/^\/apps\/?/, '').replace(/(^\/|\/$)/g, '');
      if (slug) {
        window.localStorage.setItem('lastAppVisited', slug);
      }
    } catch (_err) {
      // no-op on failure
    }
    // allow default navigation
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col justify-between shadow-sm bg-white">
      <div>
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="mt-4 text-right">
        <a
          href={href}
          onClick={handleClick}
          className="inline-flex items-center px-3 py-1.5 bg-primary text-white rounded-md text-sm"
        >
          Open
        </a>
      </div>
    </div>
  );
}

export default RecommendationCard;
