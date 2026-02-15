import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";

interface Props {
  params: { slug: string };
}

export default async function AppPage({ params }: Props) {
  const { slug } = params;

  const appPath = path.join(
    process.cwd(),
    "app-factory/generated-apps",
    slug,
    "onboarding",
    "App.tsx"
  );

  if (!fs.existsSync(appPath)) {
    notFound();
  }

  const DynamicApp = dynamic(
    () => import(`@/app-factory/generated-apps/${slug}/onboarding/App`),
    { ssr: false }
  );

  return <DynamicApp />;
}
