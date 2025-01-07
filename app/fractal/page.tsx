import ClientOnly from '@/app/components/client-only';
import FractalGenerator from './fractal-generator';

export default function FractalPage() {
  return (
    <ClientOnly>
      <FractalGenerator />
    </ClientOnly>
  );
} 