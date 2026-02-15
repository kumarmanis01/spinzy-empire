'use client';

import React from 'react';
import SmartHero from './CapabilityLanding/SmartHero';
import RecommendedSection from './CapabilityLanding/RecommendedSection';
import ContinueSection from './CapabilityLanding/ContinueSection';
import ExploreSection from './CapabilityLanding/ExploreSection';
import useCurrentUser from '@/hooks/useCurrentUser';

/**
 * Capability-centered landing Dashboard
 * Composes modular sections: Hero, Recommendations, Continue, Explore
 */
export default function Dashboard() {
  const { data: user } = useCurrentUser() as any;
  const isColdStart = true; // deterministic cold-start until activity service exists

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <SmartHero />

      {isColdStart ? (
        <RecommendedSection user={user} />
      ) : (
        <>
          <RecommendedSection user={user} />
          <ContinueSection />
        </>
      )}

      <ExploreSection />
    </div>
  );
}
