"use client";

import React from 'react';
import Link from 'next/link';

export interface ResultScreenProps {
  result: any;
  currentSlug?: string;
}

export function ResultScreen({ result, currentSlug }: ResultScreenProps) {
  const payload = result?.payload || result;
  const nextSlug = payload?.nextSlug;
  const nextApps = nextSlug ? (Array.isArray(nextSlug) ? nextSlug : [nextSlug]) : [];

  // Debugging helpers — remove or gate behind a flag in production
  try {
    // eslint-disable-next-line no-console
    console.log('ResultScreen currentSlug', currentSlug);
    // eslint-disable-next-line no-console
    console.log('Result payload nextSlug', nextSlug);
  } catch {}

  return (
    <div>
      <h3>Result</h3>
      <pre>{JSON.stringify(result, null, 2)}</pre>

      {nextApps.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium">Next Recommended</h3>
          <div className="mt-2 space-y-2">
            {nextApps.map((slug) => (
              <Link key={slug} href={`/apps/${slug}`} className="text-blue-600 underline">
                Continue to {slug.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
