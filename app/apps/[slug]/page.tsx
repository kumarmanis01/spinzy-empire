import ClientAppLoader from "./ClientAppLoader";

export default function AppPage({
  params,
}: {
  params: { slug: string };
}) {
  return <ClientAppLoader slug={params.slug} />;
}
