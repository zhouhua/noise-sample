import ClientOnly from '@/app/components/client-only';
import FrostedGlassGenerator from './frosted-glass-generator';

export default function FrostedGlassPage() {
  return (
    <ClientOnly>
      <FrostedGlassGenerator />
    </ClientOnly>
  );
} 