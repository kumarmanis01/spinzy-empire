"use client";

import dynamic from "next/dynamic";
import { GeneratedApps } from "@/app-factory/generated-apps/registry";
import { logger } from "@/lib/logger";

export default function ClientAppLoader({
  slug,
}: {
  slug: string;
}) {
  const importer = GeneratedApps[slug];

  logger.info(`Slug requested: ${slug}`);
  logger.info(`Available apps: ${Object.keys(GeneratedApps).join(", ")}`);

  if (!importer) {
    return <div>App not found</div>;
  }

  const DynamicApp = dynamic(importer, { ssr: false });

  return <DynamicApp currentSlug={slug} />;
}
