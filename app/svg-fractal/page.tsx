import ClientOnly from '@/app/components/client-only';
import SvgFractalGenerator from './svg-fractal-generator';

export default function SvgFractalPage() {
  return (
    <ClientOnly>
      <SvgFractalGenerator />
    </ClientOnly>
  );
} 