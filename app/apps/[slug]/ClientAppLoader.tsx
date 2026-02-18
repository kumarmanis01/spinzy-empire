"use client";

import dynamic from "next/dynamic";
import { GeneratedApps } from "@/app-factory/generated-apps/registry";
import { logger } from "@/lib/logger";
import { useEffect } from "react";
import { recordAppUsage } from '@/app/utils/recordAppUsage';

export default function ClientAppLoader({
  slug,
}: {
  slug: string;
}) {
  const importer = GeneratedApps[slug];

  logger.info(`Slug requested: ${slug}`);
  logger.info(`Available apps: ${Object.keys(GeneratedApps).join(", ")}`);

  useEffect(() => {
    try {
      recordAppUsage(slug)
    } catch (e) {}
  }, [slug])

  if (!importer) {
    return <div>App not found</div>;
  }

  const DynamicApp = dynamic(importer, { ssr: false });

  return <DynamicApp currentSlug={slug} />;
}
