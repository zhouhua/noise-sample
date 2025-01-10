import SvgTurbulenceGenerator from './svg-turbulence-generator';
import { Metadata } from 'next';
import { t } from '@/i18n';

export const metadata: Metadata = {
  title: t('svgTurbulence.title'),
  description: t('svgTurbulence.description'),
};

export default function SvgTurbulencePage() {
  return <SvgTurbulenceGenerator />;
} 