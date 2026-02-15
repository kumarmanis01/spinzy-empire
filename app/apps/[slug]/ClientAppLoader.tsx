"use client";

import dynamic from "next/dynamic";
import { GeneratedApps } from "@/app-factory/generated-apps/registry";

export default function ClientAppLoader({
  slug,
}: {
  slug: string;
}) {
  const importer = GeneratedApps[slug];

  if (!importer) {
    return <div>App not found</div>;
  }

  const DynamicApp = dynamic(importer, { ssr: false });

  return <DynamicApp />;
}
