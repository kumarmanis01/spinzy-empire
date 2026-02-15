'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCurrentUser from '@/hooks/useCurrentUser';

export default function SmartHero() {
  const router = useRouter();
  const { data: profile } = useCurrentUser() as any;
  const name = profile?.name ?? 'Student';
  const [query, setQuery] = useState('');

  function handleExplain() {
    const q = query.trim();
    const url = `/apps/topic-explanation${q ? `?q=${encodeURIComponent(q)}` : ''}`;
    router.push(url);
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Good evening, {name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Ask anything you'd like explained.</p>
      </div>

      <div className="flex gap-3">
        <input
          aria-label="What would you like explained today?"
          placeholder="What would you like explained today?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-lg focus:outline-none"
        />
        <button onClick={handleExplain} className="px-4 py-3 bg-primary text-white rounded-lg">
          Explain Now
        </button>
      </div>
    </section>
  );
}
