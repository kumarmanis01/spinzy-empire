import ClientAppLoader from "./ClientAppLoader";

export default async function AppPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ClientAppLoader slug={slug} />;
}
