import ClientOnly from '@/app/components/client-only';
import PerlinGenerator from './perlin-generator';

export default function PerlinPage() {
  return (
    <ClientOnly>
      <PerlinGenerator />
    </ClientOnly>
  );
} 