import ClientOnly from '@/app/components/client-only';
import NoiseGenerator from './noise-generator';

export default function NoisePage() {
  return (
    <ClientOnly>
      <NoiseGenerator />
    </ClientOnly>
  );
} 