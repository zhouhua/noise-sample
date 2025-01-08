import ClientOnly from '@/app/components/client-only';
import SvgTurbulenceGenerator from './svg-turbulence-generator';

export default function SvgTurbulencePage() {
  return (
    <ClientOnly>
      <SvgTurbulenceGenerator />
    </ClientOnly>
  );
} 