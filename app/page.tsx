import { NordicPineShowcase } from '@/components/NordicPineShowcase';

interface PageProps {
  searchParams: Promise<{ autostart?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const skipIntro = params?.autostart === '1';

  return <NordicPineShowcase initialAutostart={skipIntro} />;
}
