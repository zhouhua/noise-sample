import ClientOnly from '@/app/components/client-only';
import AnimatedNoiseGenerator from './animated-noise-generator';

export default function AnimatedNoisePage() {
  return (
    <ClientOnly>
      <AnimatedNoiseGenerator />
    </ClientOnly>
  );
} 